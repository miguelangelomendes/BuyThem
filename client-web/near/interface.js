import * as nearAPI from 'near-api-js';
import getConfig from './config'
import Big from "big.js";

const nearConfig = getConfig(process.env.NODE_ENV || 'testnet')
let contract = null
let currentUser = null
let walletConnection = null

// Taken from: https://github.com/near-examples/rust-status-message/blob/master/frontend/index.js#L8-L41
// Ref: https://github.com/near/near-api-js/blob/master/examples/quick-reference.md
export async function initContract() {
  const near = await nearAPI.connect({ keyStore: new nearAPI.keyStores.BrowserLocalStorageKeyStore(), ...nearConfig });

  walletConnection = new nearAPI.WalletConnection(near);
  if (walletConnection.getAccountId()) {
    const accountState = await walletConnection.account().state()
    currentUser = { accountId: walletConnection.getAccountId(), balance: nearAPI.utils.format.formatNearAmount(accountState.amount.toString()) };
  }

  contract = new nearAPI.Contract(walletConnection.account(), nearConfig.contractName, {
    viewMethods: ["get_items", "get_purchased_items", "get_own_items"],
    changeMethods: ["create_item", "purchase_item"],
    sender: walletConnection.getAccountId()
  });

  return { contract, currentUser, nearConfig, walletConnection };
}

export async function logout() {
  const signOut = async () => {
    return await walletConnection.signOut();
  };

  await signOut()
  window.location.replace(window.location.origin + window.location.pathname)
}

export async function login() {
  // Allow the current app to make calls to the specified contract on the
  // user's behalf.
  // This works by creating a new access key for the user's account and storing
  // the private key in localStorage.
  const signIn = async () => {
    return await walletConnection.requestSignIn(nearConfig.contractName, "BuyThem")
  };

  return await signIn()
}
export async function getUserId() {
  if (walletConnection) {

    const userId = async () => {
      return await walletConnection.getAccountId()
    };

    return await userId()
  }
  return null
}


/**
 * 
 * Custom Methods
 * 
 */

export async function getItems() {
  if (!contract) {
    throw Error('Contract not initialized')
  }
  const items = await contract.get_items({ account_id: currentUser.accountId })
  return items.map(item => {
    item.price = nearAPI.utils.format.formatNearAmount(item.price);
    return item
  })
}

export async function getOwnItems() {
  if (!contract) {
    throw Error('Contract not initialized')
  }
  if (!currentUser) {
    throw Error('User not logged in')
  }
  try {
    const items = await contract.get_own_items({ account_id: currentUser.accountId.toString() })
    return items
  } catch (error) {
    console.log("error", error)
  }

}
export async function getPruchases() {
  if (!contract) {
    throw Error('Contract not initialized')
  }
  if (!currentUser) {
    throw Error('User not logged in')
  }
  const items = await contract.get_purchased_items({ account_id: currentUser.accountId })
  return items
}

const BOATLOAD_OF_GAS = Big(3).times(10 ** 13).toFixed();
export async function createItem(item) {
  if (!contract) {
    throw Error('Contract not initialized')
  }
  const createdItem = await contract.create_item(
    {
      // Transform Near amount to Yocto
      price: nearAPI.utils.format.parseNearAmount(item.price.toString()),
      description: item.description,
      uri: item.uri
    }, BOATLOAD_OF_GAS
  )
  return createdItem
}
export async function buyItem(id, price) {
  if (!contract) {
    throw Error('Contract not initialized')
  }
  // Transform Near amount to Yocto
  const amount = nearAPI.utils.format.parseNearAmount(price.toString());
  const item = await contract.purchase_item(
    {
      id: id
    }, BOATLOAD_OF_GAS, amount)
  return item
}