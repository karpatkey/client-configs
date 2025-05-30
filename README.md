# client-configs

This projects hosts roles permissions and other configurations for clients

## Pre-requisites

- node v21 (other versions might work)
- yarn v1 (classic)
- anvil v0.2 (install through [foundryup](https://book.getfoundry.sh/getting-started/installation#using-foundryup))

## Setup

- `yarn install`
- `yarn setup`

## Commands

##### Run tests:

`yarn test`

##### Apply permission updates to a role

To apply permission updates to a role run the following command:

`yarn apply <client> <account>(/<instance>) <role>`

Possible values:

- **client:** `balancer-dao`, `ens-dao`, `gnosis-ltd`, ...
- **account:** `mainnet`, `gno`
- **instance:** `main`, `test`, ... (defaults to `main`)
- **role:** `MANAGER`, `DISASSEMBLER`, ...

Examples:

- `yarn apply gnosis-dao mainnet MANAGER`
- `yarn apply balancer-dao mainnet/test MANAGER`

This will take you to the Zodiac Roles app for a visual overview of the updates.
From there you can download the update transaction payload.

For getting the update transaction payload directly, without depending on the Roles app, run the following command:

`yarn apply:export <client> <account>(/<instance>) <role>`

This will write a JSON file to the ./export folder. This file can be uploaded to the Safe Transaction Builder app for execution.
