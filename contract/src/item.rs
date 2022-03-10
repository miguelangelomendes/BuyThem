// To conserve gas, efficient serialization is achieved through Borsh (http://borsh.io/)
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::json_types::U128;
use near_sdk::{env, AccountId, PanicOnDefault};
use serde::Serialize;

// #[near_bindgen]
#[derive(BorshSerialize, BorshDeserialize, Clone, PanicOnDefault, Serialize)]
pub struct Item {
    id: u64,
    price: U128,
    uri: Option<String>,
    owner_account_id: AccountId,
    description: Option<String>,
}

// not marked with #[near_bindgen] because it is not intended to be used by external code
impl Item {
    pub fn new(id: u64, price: U128, uri: String, description: Option<String>) -> Self {
        if uri.is_empty() {
            panic!("uri cannot be empty");
        }

        if price.0 == 0 {
            panic!("price must be positive");
        }

        Item {
            id,
            price,
            uri: uri.into(),
            owner_account_id: env::signer_account_id(),
            description,
        }
    }

    pub fn id(&self) -> u64 {
        self.id
    }

    pub fn price(&self) -> U128 {
        self.price
    }

    pub fn owner_account_id(&self) -> &AccountId {
        &self.owner_account_id
    }

    pub fn get_own(&self, account_id: &AccountId) -> Option<Self> {
        if account_id == &self.owner_account_id {
            Some(self.clone())
        } else {
            None
        }
    }

    pub fn get_mapped(&self, account_id: &AccountId, purchases: Option<Vec<u64>>) -> Self {
        let account_id_clone = account_id.clone();
        Item {
            id: self.id.clone(),
            uri: if account_id_clone == self.owner_account_id
                || purchases.unwrap_or_default().contains(&self.id)
            {
                self.uri.clone()
            } else {
                None
            },
            price: self.price.clone(),
            description: self.description.clone(),
            owner_account_id: self.owner_account_id.clone(),
        }
    }
}

/**
 *
 * TESTS
 *
 */

#[cfg(test)]
mod tests {
    use super::*;
    use near_sdk::test_utils::VMContextBuilder;
    use near_sdk::{testing_env, AccountId};

    // Set up the testing context and unit test environment
    fn owner_account_id() -> AccountId {
        return AccountId::new_unchecked("alice.testnet".to_string());
    }

    fn get_context(signer: &AccountId) -> VMContextBuilder {
        let mut builder = VMContextBuilder::new();

        builder.signer_account_id(signer.clone());
        builder
    }

    fn init_item() -> Item {
        Item::new(
            1,
            U128::from(100),
            "QmTxeBMGxE8hkkMEMjpwjd3Yv5jA1mcF3GUpRW5v8cgvxW".to_string(),
            Some("This is a description".to_string()),
        )
    }

    #[test]
    #[should_panic]
    fn test_create_with_price_0() {
        // Acting as alice now owner_account_id
        let context = get_context(&owner_account_id());
        testing_env!(context.build());

        let _item = Item::new(
            1,
            U128::from(0),
            "QmTxeBMGxE8hkkMEMjpwjd3Yv5jA1mcF3GUpRW5v8cgvxW".to_string(),
            Some("This is a description".to_string()),
        );
        // Should panic - price cannot be 0
    }

    #[test]
    #[should_panic]
    fn test_create_with_empty_uri() {
        // Acting as alice now owner_account_id
        let context = get_context(&owner_account_id());
        testing_env!(context.build());

        let _item = Item::new(
            1,
            U128::from(10),
            "".to_string(),
            Some("This is a description".to_string()),
        );
        // Should panic - uri cannot be empty
    }

    #[test]
    fn test_init_item() {
        // Acting as alice now owner_account_id
        let context = get_context(&owner_account_id());
        testing_env!(context.build());

        // Set up item object and call the new method
        let item = Item::new(
            1,
            U128::from(100),
            "QmTxeBMGxE8hkkMEMjpwjd3Yv5jA1mcF3GUpRW5v8cgvxW".to_string(),
            Some("This is a description".to_string()),
        );
        assert_eq!(item.id, 1, "Item id should be 1");
        assert_eq!(item.price, U128::from(100), "Item price should be 100");
        assert_eq!(
            item.uri,
            Some("QmTxeBMGxE8hkkMEMjpwjd3Yv5jA1mcF3GUpRW5v8cgvxW".to_string()),
            "Item uri should be QmTxeBMGxE8hkkMEMjpwjd3Yv5jA1mcF3GUpRW5v8cgvxW"
        );
        assert_eq!(
            item.description,
            Some("This is a description".to_string()),
            "Item price should be 100"
        );
        assert_eq!(
            item.owner_account_id,
            owner_account_id(),
            "Item owner should be alice"
        );
    }

    #[test]
    fn test_get_id() {
        // Acting as alice now owner_account_id
        let context = get_context(&owner_account_id());
        testing_env!(context.build());

        // Set up item object and call the new method
        let item = init_item();
        assert_eq!(item.id(), 1, "Item id should be 1");
    }

    #[test]
    fn test_get_price() {
        // Acting as alice now owner_account_id
        let context = get_context(&owner_account_id());
        testing_env!(context.build());

        let item = init_item();

        assert_eq!(item.price(), U128::from(100), "Item price should be 100");
    }

    #[test]
    fn test_get_owner_account_id() {
        // Acting as alice now owner_account_id
        let context = get_context(&owner_account_id());
        testing_env!(context.build());

        let item = init_item();

        assert_eq!(
            item.owner_account_id(),
            &owner_account_id(),
            "Item owner should be {}",
            owner_account_id()
        );
    }

    #[test]
    fn test_get_own_some() {
        // Acting as alice now owner_account_id
        let context = get_context(&owner_account_id());
        testing_env!(context.build());

        let item = init_item();
        let own_item = item.get_own(&owner_account_id());
        assert!(own_item.is_some(), "Should have some");
    }

    #[test]
    fn test_get_own_none() {
        // Acting as alice now owner_account_id
        let context = get_context(&owner_account_id());
        testing_env!(context.build());

        let item = init_item();

        let john = AccountId::new_unchecked("john.testnet".to_string());
        let own_item = item.get_own(&john);
        assert!(own_item.is_none(), "Should have none");
    }

    #[test]
    fn test_get_mapped_item_beeing_owner() {
        // Acting as alice now owner_account_id
        let context = get_context(&owner_account_id());
        testing_env!(context.build());

        // Set up item object and call the new method
        let item = init_item();
        let mapped_item = item.get_mapped(&owner_account_id(), None);
        assert_eq!(
            mapped_item.uri, item.uri,
            "Item uri should be QmTxeBMGxE8hkkMEMjpwjd3Yv5jA1mcF3GUpRW5v8cgvxW"
        );
    }

    #[test]
    fn test_get_mapped_item_already_purchased() {
        // Acting as alice now owner_account_id
        let context = get_context(&owner_account_id());
        testing_env!(context.build());
        let item = init_item();

        // Acting as john now
        let john = AccountId::new_unchecked("john.testnet".to_string());
        let mapped_item = item.get_mapped(&john, Some(vec![item.id]));
        assert_eq!(
            mapped_item.uri, item.uri,
            "Item uri should be QmTxeBMGxE8hkkMEMjpwjd3Yv5jA1mcF3GUpRW5v8cgvxW"
        );
    }

    #[test]
    fn test_get_mapped_item_not_purchased() {
        // Acting as alice now owner_account_id
        let context = get_context(&owner_account_id());
        testing_env!(context.build());
        let item = init_item();

        // Acting as john now
        let john = AccountId::new_unchecked("john.testnet".to_string());
        let mapped_item = item.get_mapped(&john, None);
        assert!(mapped_item.uri.is_none(), "Item uri should be none");
    }
}
