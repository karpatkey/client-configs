import { allow } from "zodiac-roles-sdk/kit"
import { c } from "zodiac-roles-sdk"
import { PermissionList } from "@/types"
import { contracts } from "@/contracts"
import { parameters } from "../../../instances/main"
import { kpkFoundationEth } from "../../../addresses"

export default [
  /*********************************************
   * Protocol permissions
   *********************************************/
  // Spark - DSR_sDAI
  allow.gnosis.spark.savingsXdaiAdapter.redeem(undefined, c.avatar),
  allow.gnosis.spark.savingsXdaiAdapter.redeemXDAI(undefined, c.avatar),
  // Bridge - Gnosis -> Mainnet
  // XDAI (Gnosis) -> DAI (Mainnet)
  allow.gnosis.xdaiBridge2.relayTokens(kpkFoundationEth, {
    send: true,
  }),

  // GNO (Gnosis) -> GNO (Mainnet)
  allow.gnosis.gno.transferAndCall(
    contracts.gnosis.xdaiBridge,
    undefined,
    parameters.avatar
  ),
] satisfies PermissionList
