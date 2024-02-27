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

`yarn apply <client> <chain> <role>`

Possible values:

- **client:** `balancer`, `ens`, `gnosis_ltd`, ...
- **chain:** `eth`, `gno`
- **role:** `manage`, `disassemble`, ...
