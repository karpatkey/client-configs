import { c, PermissionSet } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import { Address } from "@gnosis-guild/eth-sdk"
import { zeroAddress } from "../eth-sdk/addresses"

export const transferErc20 = (token: Address, to: Address): PermissionSet => {
  return [
    // It doesn't matter the blockchain we use, since we are overwriting
    // the address of the rewarder (abis are the same indistinctively of the blockchain)
    {
      ...allow.mainnet.weth.transfer(to),
      targetAddress: token,
    },
  ]
}

export const transferEth = (from: Address, to: Address): PermissionSet => {
  return [
    // It doesn't matter the blockchain we use, since we are overwriting
    // the address of the rewarder (abis are the same indistinctively of the blockchain)
    {
      ...allow.mainnet.safe.singleton.execTransaction(
        to,
        undefined,
        "0x",
        0,
        0,
        0,
        0,
        zeroAddress,
        zeroAddress
      ),
      targetAddress: from,
      send: true,
    },
  ]
}
