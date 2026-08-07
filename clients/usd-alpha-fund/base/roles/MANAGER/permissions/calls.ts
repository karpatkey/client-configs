import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import { zeroAddress } from "@/addresses"
import { GHO, USDC } from "@/addresses/base"
import { contracts } from "@/contracts"
import { allowErc20Approve } from "@/helpers"
import { PermissionList } from "@/types"
import { Parameters } from "../../../parameters"

export default (parameters: Parameters) =>
  [
    /*********************************************
     * Bridges
     *********************************************/
    // Base -> Mainnet
    // GHO - Chainlink - transporter.io
    allowErc20Approve([GHO], [contracts.base.chainlink.router]),
    allow.base.chainlink.router.ccipSend(
      "5009297550715157269", // https://docs.chain.link/ccip/directory/mainnet/chain/mainnet
      {
        receiver: "0x" + parameters.avatar.slice(2).padStart(64, "0"),
        data: "0x",
        // https://docs.chain.link/ccip/api-reference/evm/v1.6.1/client#evmtokenamount
        tokenAmounts: c.matches([
          {
            token: GHO,
            amount: undefined,
          },
        ]),
        feeToken: zeroAddress,
        // https://docs.chain.link/ccip/api-reference/evm/v1.6.1/client#generic_extra_args_v2_tag
        // https://docs.chain.link/ccip/api-reference/evm/v1.6.1/client#genericextraargsv2
        extraArgs: c.or(
          "0x",
          "0x181dcf1000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001"
        ),
      },
      {
        send: true,
      }
    ),

    // USDC - Stargate to Mainnet
    allowErc20Approve([USDC], [contracts.base.stargate.poolUsdc]),
    allow.base.stargate.poolUsdc.send(
      {
        dstEid: "30101", // Mainnet chain ID
        to: "0x" + parameters.avatar.slice(2).padStart(64, "0"),
        // 0x = default / no LayerZero options
        // 0x0003 = empty LayerZero TYPE_3 options container (OptionsBuilder.newOptions())
        // https://github.com/LayerZero-Labs/LayerZero-v2/blob/9c741e7f9790639537b1710a203bcdfd73b0b9ac/packages/layerzero-v2/evm/oapp/contracts/oapp/libs/OptionsBuilder.sol#L22
        extraOptions: c.or("0x", "0x0003"),
        composeMsg: "0x",
        oftCmd: c.or("0x", "0x01"), // https://docs.stargate.finance/developers/protocol-docs/transfer#sendparamoftcmd
      },
      undefined,
      c.avatar,
      {
        send: true,
      }
    ),
  ] satisfies PermissionList
