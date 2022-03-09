use crate::item::Item;
use core::panic;
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::collections::LookupMap;
use near_sdk::json_types::U128;
use near_sdk::{env, near_bindgen, AccountId, Promise};
use std::convert::TryFrom;
use std::vec;

mod item;

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize)]
pub struct Contract {
    album: Vec<Item>,
    purchases: LookupMap<AccountId, Vec<u64>>,
}
impl Default for Contract {
    fn default() -> Self {
        Self {
            album: vec![],
            purchases: LookupMap::new(b"p".to_vec()),
        }
    }
}

#[near_bindgen]
impl Contract {
    pub fn get_items(&self, account_id: &AccountId) -> Vec<Item> {
        let items = &self.album;
        items
            .iter()
            .map(|item| {
                item.get_mapped(
                    &account_id,
                    Some(self.purchases.get(&account_id).unwrap_or_default()),
                )
            })
            .collect()
    }

    pub fn get_purchased_items(&self, account_id: AccountId) -> Vec<Item> {
        let purchases = self.purchases.get(&account_id).unwrap_or_default();
        let items = &self.album;
        items
            .iter()
            .filter(|item| purchases.contains(&item.id()))
            .cloned()
            .collect()
    }

    pub fn get_owned_items(&self, account_id: AccountId) -> Vec<Item> {
        let items = &self.album;
        items
            .iter()
            .filter(|item| item.get_owned(&account_id).is_some())
            .cloned()
            .collect()
    }

    #[payable]
    pub fn purchase_item(&mut self, id: u64) -> Item {
        let items = self.album.clone();
        let account_id = env::signer_account_id().clone();
        let item = items
            .iter()
            .find(|item| item.id() == id)
            .expect("Item not found");
        if &account_id == item.owner_account_id() {
            panic!("You own this item");
        }
        let price = item.price();
        let payment = near_sdk::env::attached_deposit();
        if payment >= price.0 {
            let amount_to_send = payment - (payment / 10) as u128;
            self.transfer_funds(&item.owner_account_id(), amount_to_send);
            self.add_to_purchases(&account_id, id);
            //Return item
            item.get_mapped(&account_id, Some(vec![id]))
        } else {
            panic!("Not enough funds {} to pay {}", payment, price.0);
        }
    }

    pub fn create_item(&mut self, price: U128, uri: String, description: Option<String>) -> Item {
        let id = u64::try_from(self.album.len() + 1).unwrap();
        let item = Item::new(id, price, uri, description);

        self.album.push(item.clone());
        // Return created item
        item
    }

    #[private]
    pub fn add_to_purchases(&mut self, account_id: &AccountId, item_id: u64) -> Vec<u64> {
        let mut purchases = self.get_purchases(&account_id).unwrap_or_default();
        purchases.push(item_id);
        self.purchases.insert(&account_id, &purchases);
        self.get_purchases(account_id).unwrap_or_default()
    }

    #[private]
    pub fn transfer_funds(&mut self, account_id: &AccountId, amount: u128) -> Promise {
        Promise::new(account_id.clone()).transfer(amount)
    }
    #[private]
    pub fn get_purchases(&self, account_id: &AccountId) -> Option<Vec<u64>> {
        self.purchases.get(account_id)
    }
}

/*****
 *
 *
 *                  TESTS
 *
 *
 */

#[cfg(test)]
mod tests {
    use super::*;
    use near_sdk::{test_utils::VMContextBuilder, testing_env, AccountId, Gas};

    fn contract_deployer() -> AccountId {
        return AccountId::new_unchecked("contract_deployer.testnet".to_string());
    }
    fn owner_account_id() -> AccountId {
        return AccountId::new_unchecked("alice.testnet".to_string());
    }
    fn buyer_account_id() -> AccountId {
        return AccountId::new_unchecked("john.testnet".to_string());
    }

    // Set mockup context
    fn get_context(signer: &AccountId, deposit: Option<u128>) -> VMContextBuilder {
        let mut builder = VMContextBuilder::new();
        builder.current_account_id(contract_deployer());
        builder.signer_account_id(signer.clone());
        builder.account_balance(100);
        builder.attached_deposit(deposit.unwrap_or(0));
        builder.prepaid_gas(Gas(30_000_000_000_000));
        builder
    }

    #[test]
    fn test_add_item_to_album_upon_create() {
        let item_price = U128(100);
        // Acting as alice now owner_account_id
        let context = get_context(&owner_account_id(), None);
        testing_env!(context.build());

        let mut contract = Contract::default();
        let _item = contract.create_item(
            item_price,
            "QmTxeBMGxE8hkkMEMjpwjd3Yv5jA1mcF3GUpRW5v8cgvxW".to_string(),
            None,
        );
        assert!(contract.album.len() == 1, "Item created");
    }

    #[test]
    fn test_get_items() {
        let context = get_context(&owner_account_id(), None);
        testing_env!(context.build());

        let mut contract = Contract::default();
        let item_price = U128(10);
        let number_of_items = 5;
        for _ in 0..number_of_items {
            let _item = &contract.create_item(
                item_price,
                "QmTxeBMGxE8hkkMEMjpwjd3Yv5jA1mcF3GUpRW5v8cgvxW".to_string(),
                None,
            );
        }
        let items = contract.get_items(&owner_account_id());
        assert_eq!(
            items.len(),
            number_of_items,
            "Not all items have been added"
        );
    }
    // PURCHASES
    #[test]
    #[should_panic]
    fn test_purchase_item_no_deposit() {
        let item_price = U128(100);
        // Acting as alice now owner_account_id
        let context = get_context(&owner_account_id(), Some(item_price.0));
        testing_env!(context.build());

        let mut contract = Contract::default();
        let _item = &contract.create_item(
            item_price,
            "QmTxeBMGxE8hkkMEMjpwjd3Yv5jA1mcF3GUpRW5v8cgvxW".to_string(),
            None,
        );

        // Acting as john now buyer_account_id
        let context = get_context(&buyer_account_id(), None);
        testing_env!(context.build());
        let _purchased_item = &contract.purchase_item(1);
        // Should panic - Not enough funds {deposit} to pay {item.price}
    }
    #[test]
    #[should_panic]
    fn test_purchase_onwed_item() {
        // Acting as alice now owner_account_id
        let context = get_context(&owner_account_id(), Some(10));
        testing_env!(context.build());

        let mut contract = Contract::default();
        let item = &contract.create_item(
            U128(10),
            "QmTxeBMGxE8hkkMEMjpwjd3Yv5jA1mcF3GUpRW5v8cgvxW".to_string(),
            None,
        );
        contract.purchase_item(item.id());
        // Should panic - You own this item
    }
    #[test]
    #[should_panic]
    fn test_purchase_non_item() {
        // Acting as alice now owner_account_id
        let context = get_context(&owner_account_id(), None);
        let mut contract = Contract::default();
        let item_price = U128(100);
        let _item = &contract.create_item(
            item_price,
            "QmTxeBMGxE8hkkMEMjpwjd3Yv5jA1mcF3GUpRW5v8cgvxW".to_string(),
            None,
        );
        testing_env!(context.build());
        // Acting as john now buyer_account_id
        let context = get_context(&buyer_account_id(), Some(item_price.0));
        testing_env!(context.build());

        contract.purchase_item(999);
        // Should panic - Item not found
    }

    #[test]
    fn test_purchase_item_added_to_purchases() {
        let item_price = U128(10);
        // Acting as alice now owner_account_id
        let context = get_context(&owner_account_id(), Some(item_price.0));
        testing_env!(context.build());

        let mut contract = Contract::default();
        let item = &contract.create_item(
            item_price,
            "QmTxeBMGxE8hkkMEMjpwjd3Yv5jA1mcF3GUpRW5v8cgvxW".to_string(),
            None,
        );
        // Acting as john now buyer_account_id
        let context = get_context(&buyer_account_id(), Some(item_price.0));
        testing_env!(context.build());
        let _purchased_item = contract.purchase_item(item.id());
        assert!(
            contract
                .get_purchases(&buyer_account_id())
                .unwrap_or_default()
                .contains(&item.id()),
            "Purchased item not added to purchases"
        );
    }

    #[test]
    fn test_purchase_item() {
        let item_price = U128(10);
        let context = get_context(&owner_account_id(), Some(item_price.0));
        testing_env!(context.build());

        let mut contract = Contract::default();
        let item = &contract.create_item(
            item_price,
            "QmTxeBMGxE8hkkMEMjpwjd3Yv5jA1mcF3GUpRW5v8cgvxW".to_string(),
            None,
        );
        let context = get_context(&buyer_account_id(), Some(item_price.0));
        testing_env!(context.build());
        let _purchased_item = contract.purchase_item(item.id());
        assert!(
            contract
                .get_purchases(&buyer_account_id())
                .unwrap_or_default()
                .contains(&item.id()),
            "Item not added to purchases"
        );
    }

    #[test]
    fn test_add_purchased_item() {
        let item_price = U128(10);
        let context = get_context(&owner_account_id(), Some(item_price.0));
        testing_env!(context.build());

        let mut contract = Contract::default();
        let item = &contract.create_item(
            item_price,
            "QmTxeBMGxE8hkkMEMjpwjd3Yv5jA1mcF3GUpRW5v8cgvxW".to_string(),
            None,
        );
        contract.add_to_purchases(&owner_account_id(), item.id());

        assert!(
            contract
                .get_purchases(&owner_account_id())
                .unwrap_or_default()
                .len()
                == 1,
            "Item not added to purchases"
        );
    }

    // #[test]
    // fn test_receive_payment_on_purchase() {
    //     // Acting as alice now owner_account_id
    //     let context = get_context(&owner_account_id(), Some(U128(100).0));
    //     testing_env!(context.build());

    //     let item_price = U128(100);
    //     let mut contract = Contract::default();
    //     let item = &contract.create_item(
    //         item_price,
    //         "QmTxeBMGxE8hkkMEMjpwjd3Yv5jA1mcF3GUpRW5v8cgvxW".to_string(),
    //         None,
    //     );
    //     log!("item price: {}", item_price.0);
    //     // Acting as john now buyer_account_id
    //     let context = get_context(&buyer_account_id(), Some(U128(1000).0));
    //     testing_env!(context.build());

    //     let initial_balance = env::account_balance();
    //     log!("initial_balance: {}", initial_balance);

    //     let _purchased_item = contract.purchase_item(item.id());

    //     let balance_after_purchase = env::account_balance();
    //     log!("balance after purchase: {}", balance_after_purchase);

    //     assert!(
    //         initial_balance - balance_after_purchase == item_price.0,
    //         "Initial balance {} - Balance after purchase {} must be equal to item price: {}",
    //         initial_balance,
    //         balance_after_purchase,
    //         item_price.0
    //     );
    // }

    // #[test]
    // fn test_transfer_payment_to_owner_on_purchase() {
    //     let item_price = U128(100);
    //     // Acting as alice now owner_account_id
    //     let context = get_context(&owner_account_id(), Some(item_price.0));
    //     testing_env!(context.build());

    //     let mut contract = Contract::default();
    //     let initial_balance = env::account_balance();
    //     let item = &contract.create_item(
    //         item_price,
    //         "QmTxeBMGxE8hkkMEMjpwjd3Yv5jA1mcF3GUpRW5v8cgvxW".to_string(),
    //         None,
    //     );
    //     // Acting as john now buyer_account_id
    //     let context = get_context(&buyer_account_id(), Some(item_price.0));
    //     testing_env!(context.build());
    //     log!("signer id: {}", env::signer_account_id());
    //     log!("initial_balance: {}", env::account_balance());
    //     let _purchased_item = contract.purchase_item(item.id());
    //     log!("after_balance: {}", env::account_balance());
    //     // Acting as alice now owner_account_id
    //     let context = get_context(&owner_account_id(), Some(item_price.0));
    //     testing_env!(context.build());
    //     let balance_after = env::account_balance();
    //     let final_balance = balance_after - initial_balance;
    //     let price_less_percentage = item_price.0 - item_price.0 / 10 as u128;
    //     log!("signer id: {}", env::signer_account_id());
    //     log!("initial_balance: {}", initial_balance);
    //     log!("balance_after: {}", balance_after);
    //     log!("final_balance: {}", final_balance);
    //     log!("price_less_percentage: {}", price_less_percentage);
    //     log!("item_price.0: {}", item_price.0);

    //     assert!(
    //         final_balance == price_less_percentage,
    //         "Purchased item returned"
    //     );
    // }
}
