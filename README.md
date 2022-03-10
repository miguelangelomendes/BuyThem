# BuyThem

#### ❗️Alert
When first opening the webapp it might take a long time as the dev machines go to sleep.

[Staging](https://buythem.onrender.com)

## Description

A platform built on NEAR Protocol and Nuxt.js where anyone can sell and buy images.

Contract in `contract/src/lib.rs` provides methods to get items, purchases and own items, to create and purchase items.

## How it works
### Sell
- Create an Item with:
  - Description
  - Price
  - Image
- The system encrypts the image before uploading to IPFS and the Item is created and saved into state.
- The contract charges a 10% fee on each purchase.
- The creator receives 90% of each purchase.
### Buy
By default any item that hasn’t been bought by the current user is displayed as locked.
- Click unlock
- Approve the transaction (funds will be transferred)
- Item content is unlocked

## Setup locally
Make sure do you have `rust` and `yarn` installed

If you do not have a NEAR account, please create one with [NEAR Wallet](https://wallet.testnet.near.org).

You also need an [infura](https://infura.io/) account.
#### Contract
Navigate to contract folder and execute `build.sh` script with `-cd` as arguments to *compile* and *deploy*
```
cd contract
./build -cd
```
Copy the contract name like dev-xxxxxx-xxxx

To test
```
cargo test -- --nocapture
```
### Frontend
Navigate to client-web create `.env` file with:
```
NODE_ENV=testnet
## ENCRYPTION
ENCRYPTION_KEY=ohmysecretkey
ENCRYPTION_IV=ohmysecretiv
## IPFS - Infura
PROJECT_ID=XXXXXXXXXXXXXXXXXXX
PROJECT_SECRET=XXXXXXXXXXXXXXX
```
open ``config.js`` and past the contract name, save and execute `yarn` to install the dependencies and `yarn dev` to run it

