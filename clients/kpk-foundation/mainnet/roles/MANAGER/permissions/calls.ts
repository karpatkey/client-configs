import { PermissionList } from "@/types"
import { allow } from "zodiac-roles-sdk/build/cjs/sdk/src/entrypoints/kit"
import { c } from "zodiac-roles-sdk"
import { allowErc20Approve, allowErc20Transfer } from "@/helpers"
import { DAI, sUSDS, USDC, USDS, USDT } from "@/addresses/eth"
import { contracts } from "@/contracts"
import { kfPaymentsMainnet, kpkDaoPaymentsMainnet } from "../../../../../kpk-dao/mainnet/addresses"
import { kpkFoundationGc, kpkFoundationPayments } from "../../../addresses"
import { encodeBytes32String } from "defi-kit"

export default [
  // Sky - DSR (DAI Savings Rate)
  // The DsrManager provides an easy to use smart contract that allows
  // service providers to deposit/withdraw dai into the DSR contract pot,
  // and activate/deactivate the Dai Savings Rate to start earning savings
  // on a pool of dai in a single function call.
  // https://docs.makerdao.com/smart-contract-modules/proxy-module/dsr-manager-detailed-documentation#contract-details
  allowErc20Approve([DAI], [contracts.mainnet.sky.dsrManager]),
  allow.mainnet.sky.dsrManager.join(c.avatar),
  allow.mainnet.sky.dsrManager.exit(c.avatar),
  allow.mainnet.sky.dsrManager.exitAll(c.avatar),
  // Spark - Withdraw USDS from sUSDS
  allow.mainnet.spark.sUsds["withdraw(uint256,address,address)"](
    undefined,
    c.avatar,
    c.avatar
  ),
  // Spark - Withdraw DAI from sDAI
  allow.mainnet.spark.sDai["withdraw(uint256,address,address)"](
    undefined,
    c.avatar,
    c.avatar
  ),
  //TODO check this
  // Spark - Withdraw USDC from sUSDC
  allow.mainnet.spark.sUsdc["withdraw(uint256,address,address)"](
    undefined,
    c.avatar,
    c.avatar
  ),
  /*********************************************
   * Bridging
   *********************************************/
  //TODO naming of the addresses
  // Mainnet -> Gnosis
  // DAI -> XDAI - Gnosis Bridge
  ...allowErc20Approve([DAI], [contracts.mainnet.gnoXdaiBridge]),
  allow.mainnet.gnoXdaiBridge.relayTokens(
    kpkFoundationGc,
    c.withinAllowance(encodeBytes32String("DAI_KPK_FOUNDATION-GC") as `0x${string}`)
  ),
  allow.mainnet.gnoXdaiBridge.relayTokens(kpkGC),
  // Claim bridged XDAI from Gnosis
  allow.mainnet.gnoXdaiBridge.executeSignatures(
    c.and(
      // Avatar address
      c.bitmask({
        shift: 0,
        mask: "0xffffffffffffffffffff",
        value: parameters.avatar.slice(0, 22), // First 10 bytes of the avatar address
      }),
      c.bitmask({
        shift: 10,
        mask: "0xffffffffffffffffffff",
        value: "0x" + parameters.avatar.slice(22, 42), // Last 10 bytes of the avatar address
      }),
      // skip 32 bytes corresponding to the amount
      // skip 32 bytes corresponding to the txHash from Gnosis
      // Recipient address: Gnosis Chain xDai Bridge
      c.bitmask({
        shift: 20 + 32 + 32,
        mask: "0xffffffffffffffffffff",
        value: contracts.mainnet.gnoXdaiBridge.slice(0, 22), // First 10 bytes of the avatar address
      }),
      c.bitmask({
        shift: 20 + 32 + 32 + 10,
        mask: "0xffffffffffffffffffff",
        value: "0x" + contracts.mainnet.gnoXdaiBridge.slice(22, 42), // Last 10 bytes of the avatar address
      })
    )
  ),
  /*********************************************
   * Transfers
   *********************************************/
  // Transfer 100K per month to kfPaymentsMainnet, kpkFoundationPayments
  allowErc20Transfer(
    [USDC],
    [kfPaymentsMainnet, kpkFoundationPayments],
    "USDC_KPK_FOUNDATION-PAYMENTS-ETH"
  ),
] satisfies PermissionList
