import { c } from "zodiac-roles-sdk"
import { EVERYTHING, allow } from "zodiac-roles-sdk/kit"
import { allow as allowAction } from "defi-kit/eth"
import {
  COMP,
  DAI,
  sDAI,
  USDC,
  WBTC,
  wstETH,
  ZERO_ADDRESS,
  morpho,
} from "../../../../../eth-sdk/addresses"
import {
  DAI as DAI_opt,
  COMP as COMP_opt,
  USDC as USDC_opt,
} from "../../../../../eth-sdk/addresses_opt"
import { USDC as USDC_arb } from "../../../../../eth-sdk/addresses_arb"
import { USDC as USDC_base } from "../../../../../eth-sdk/addresses_base"
import { contracts } from "../../../../../eth-sdk/config"
import { allowErc20Approve } from "../../../../../utils/erc20"
import { PermissionList } from "../../../../../types"
import { avatar } from "../../index"

export default [
  /*********************************************
   * Defi-Kit permissions
   *********************************************/
  // Aave v3 - Deposit DAI
  allowAction.aave_v3.deposit({ targets: ["DAI"] }),
  // Aave v3 - Deposit sDAI
  allowAction.aave_v3.deposit({ targets: ["sDAI"] }),
  // Aave v3 - Deposit USDC
  allowAction.aave_v3.deposit({ targets: ["USDC"] }),
  // Aave v3 - Borrow DAI
  allowAction.aave_v3.borrow({ targets: ["DAI"] }),
  // Aave v3 - Borrow USDC
  allowAction.aave_v3.borrow({ targets: ["USDC"] }),

  // Cowswap - Holdings swaps
  allowAction.cowswap.swap({
    sell: [COMP, DAI, sDAI, USDC],
    buy: [DAI, sDAI, USDC],
  }),

  // Spark - DSR/sDAI
  allowAction.spark.deposit({ targets: ["DSR_sDAI"] }),
  // Spark - Deposit sDAI
  allowAction.spark.deposit({ targets: ["sDAI"] }),
  // Spark - Borrow DAI
  allowAction.spark.borrow({ targets: ["DAI"] }),
  // Spark - Borrow USDC
  allowAction.spark.borrow({ targets: ["USDC"] }),

  /*********************************************
   * Typed-presets permissions
   *********************************************/
  // Compound v3 - USDC
  ...allowErc20Approve([USDC], [contracts.mainnet.compound_v3.cUSDCv3]),
  allow.mainnet.compound_v3.cUSDCv3.supply(USDC),
  allow.mainnet.compound_v3.cUSDCv3.withdraw(USDC),
  // Compound v3 - Claim rewards
  allow.mainnet.compound_v3.CometRewards.claim(undefined, c.avatar),

  // Maker - DSR (DAI Savings Rate)
  // The DsrManager provides an easy to use smart contract that allows
  // service providers to deposit/withdraw dai into the DSR contract pot,
  // and activate/deactivate the Dai Savings Rate to start earning savings
  // on a pool of dai in a single function call.
  // https://docs.makerdao.com/smart-contract-modules/proxy-module/dsr-manager-detailed-documentation#contract-details
  ...allowErc20Approve([DAI], [contracts.mainnet.maker.dsr_manager]),
  allow.mainnet.maker.dsr_manager.join(c.avatar),
  allow.mainnet.maker.dsr_manager.exit(c.avatar),
  allow.mainnet.maker.dsr_manager.exitAll(c.avatar),

  // Morpho Blue - wstETH/USDC
  ...allowErc20Approve([USDC], [contracts.mainnet.morpho.morpho_blue]),
  allow.mainnet.morpho.morpho_blue.supply(
    {
      loanToken: USDC,
      collateralToken: wstETH,
      oracle: morpho.Oracle_wstETH_USDC,
      irm: morpho.Adaptative_Curve_IRM,
    },
    undefined,
    0,
    c.avatar,
    "0x"
  ),
  allow.mainnet.morpho.morpho_blue.withdraw(
    {
      loanToken: USDC,
      collateralToken: wstETH,
      oracle: morpho.Oracle_wstETH_USDC,
      irm: morpho.Adaptative_Curve_IRM,
    },
    undefined,
    0,
    c.avatar,
    c.avatar
  ),
  // Morpho Blue - WBTC/USDC
  // USDC approval already included
  allow.mainnet.morpho.morpho_blue.supply(
    {
      loanToken: USDC,
      collateralToken: WBTC,
      oracle: morpho.Oracle_WBTC_USDC,
      irm: morpho.Adaptative_Curve_IRM,
    },
    undefined,
    0,
    c.avatar,
    "0x"
  ),
  allow.mainnet.morpho.morpho_blue.withdraw(
    {
      loanToken: USDC,
      collateralToken: WBTC,
      oracle: morpho.Oracle_WBTC_USDC,
      irm: morpho.Adaptative_Curve_IRM,
    },
    undefined,
    0,
    c.avatar,
    c.avatar
  ),

  /*********************************************
   * Swaps
   *********************************************/
  // Curve - 3pool - Swap DAI <-> USDC
  ...allowErc20Approve([DAI, USDC], [contracts.mainnet.curve.x3CRV_pool]),
  allow.mainnet.curve.x3CRV_pool.exchange(
    c.or(0, 1), // 0 = DAI, 1 = USDC
    c.or(0, 1)
  ),

  /*********************************************
   * Bridge
   *********************************************/
  // Mainnet -> Gnosis
  // DAI -> XDAI
  ...allowErc20Approve([DAI], [contracts.mainnet.gno_xdai_bridge]),
  allow.mainnet.gno_xdai_bridge.relayTokens(c.avatar, undefined),
  // DAI (Mainnet) -> DAI (Gnosis) - HOP
  ...allowErc20Approve([DAI], [contracts.mainnet.hop_dai_bridge]),
  allow.mainnet.hop_dai_bridge.sendToL2(
    100, // Gnosis
    c.avatar,
    undefined,
    undefined,
    undefined,
    "0x9298dfD8A0384da62643c2E98f437E820029E75E" // Relayer
  ),
  // DAI (Mainnet) -> DAI (Gnosis) - Connext
  // The xcall() function was added manually in the contracts' ABI
  // Implementation: 0x3606b0D9c84224892C7407d4e8DCfd7E9E2126A2
  ...allowErc20Approve([DAI], [contracts.mainnet.connext_bridge]),
  // To get the Domain ID: https://docs.connext.network/resources/deployments
  // Mainnet: 6648936
  // Optimism: 1869640809
  // Arbitrum: 1634886255
  // Gnosis: 6778479
  // Base: 1650553709
  allow.mainnet.connext_bridge[
    "xcall(uint32,address,address,address,uint256,uint256,bytes)"
  ](
    6778479,
    "0x642c27a96dFFB6f21443A89b789a3194Ff8399fa", // Connext: Unwrapper (Gnosis Chain)
    DAI,
    c.avatar,
    undefined,
    undefined,
    "0x" + avatar.slice(2).padStart(64, "0"),
    {
      send: true,
    }
  ),
  // COMP (Mainnet) -> COMP (Gnosis)
  ...allowErc20Approve([COMP], [contracts.mainnet.gno_omnibridge]),
  allow.mainnet.gno_omnibridge["relayTokens(address,address,uint256)"](
    COMP,
    c.avatar
  ),
  // Claim bridged COMP from Gnosis
  allow.mainnet.amb_eth_xdai.safeExecuteSignaturesWithAutoGasLimit(
    c.and(
      // messageId: 32 bytes
      // First 4 bytes
      c.bitmask({
        shift: 0,
        mask: "0xffffffff",
        value: "0x00050000",
      }),
      // Next 10 bytes
      c.bitmask({
        shift: 4,
        mask: "0xffffffffffffffffffff",
        value: "0xa7823d6f1e31569f5186",
      }),
      // Next 10 bytes
      c.bitmask({
        shift: 4 + 10,
        mask: "0xffffffffffffffffffff",
        value: "0x1e345b30c6bebf70ebe7",
      }),
      // skip last 8 bytes (nonce)
      // sender: 20 bytes
      c.bitmask({
        shift: 32,
        mask: "0xffffffffffffffffffff",
        value: contracts.gnosis.xdai_bridge.slice(0, 22), // First 10 bytes of the sender address (XDAI Bridge)
      }),
      c.bitmask({
        shift: 32 + 10,
        mask: "0xffffffffffffffffffff",
        value: "0x" + contracts.gnosis.xdai_bridge.slice(22, 42), // Second 10 bytes of the sender address (XDAI Bridge)
      }),
      // executor: 20 bytes
      c.bitmask({
        shift: 32 + 20,
        mask: "0xffffffffffffffffffff",
        value: contracts.mainnet.gno_omnibridge.slice(0, 22), // First 10 bytes of the executor address (Omnibridge)
      }),
      c.bitmask({
        shift: 32 + 20 + 10,
        mask: "0xffffffffffffffffffff",
        value: "0x" + contracts.mainnet.gno_omnibridge.slice(22, 42), // Second 10 bytes of the executor address (Omnibridge)
      }),
      // gasLimit: 4 bytes
      c.bitmask({
        shift: 32 + 20 + 20,
        mask: "0xffffffff",
        value: "0x000927c0",
      }),
      // dataType + chainIds: 5 bytes
      c.bitmask({
        shift: 32 + 20 + 20 + 4,
        mask: "0xffffffffff",
        value: "0x0101806401",
      }),
      // selector (handleNativeTokens): 4 bytes
      c.bitmask({
        shift: 32 + 20 + 20 + 4 + 5,
        mask: "0xffffffff",
        value: "0x272255bb",
      }),
      // skip the first 12 bytes (0's) of the address and scope the first 10 bytes
      // Token address
      c.bitmask({
        shift: 32 + 20 + 20 + 4 + 5 + 4 + 12,
        mask: "0xffffffffffffffffffff",
        value: COMP.slice(0, 22), // First 10 bytes of the token address
      }),
      c.bitmask({
        shift: 32 + 20 + 20 + 4 + 5 + 4 + 12 + 10,
        mask: "0xffffffffffffffffffff",
        value: "0x" + COMP.slice(22, 42), // Last 10 bytes of the token address
      }),
      // skip the first 12 bytes (0's) of the address and scope the first 10 bytes
      // Avatar address
      c.bitmask({
        shift: 32 + 20 + 20 + 4 + 5 + 4 + 32 + 12,
        mask: "0xffffffffffffffffffff",
        value: avatar.slice(0, 22), // First 10 bytes of the avatar address
      }),
      c.bitmask({
        shift: 32 + 20 + 20 + 4 + 5 + 4 + 32 + 12 + 10,
        mask: "0xffffffffffffffffffff",
        value: "0x" + avatar.slice(22, 42), // Last 10 bytes of the avatar address
      })
    )
  ),
  // USDC (Mainnet) -> USDC.e (Gnosis)
  ...allowErc20Approve([USDC], [contracts.mainnet.gno_omnibridge]),
  allow.mainnet.gno_omnibridge.relayTokensAndCall(
    USDC,
    contracts.gnosis.usdc_transmuter,
    undefined,
    "0x" + avatar.slice(2).padStart(64, "0")
  ),
  // Claim bridged USDC from Gnosis
  allow.mainnet.amb_eth_xdai.safeExecuteSignaturesWithAutoGasLimit(
    c.and(
      // messageId: 32 bytes
      // First 4 bytes
      c.bitmask({
        shift: 0,
        mask: "0xffffffff",
        value: "0x00050000",
      }),
      // Next 10 bytes
      c.bitmask({
        shift: 4,
        mask: "0xffffffffffffffffffff",
        value: "0xa7823d6f1e31569f5186",
      }),
      // Next 10 bytes
      c.bitmask({
        shift: 4 + 10,
        mask: "0xffffffffffffffffffff",
        value: "0x1e345b30c6bebf70ebe7",
      }),
      // skip last 8 bytes (nonce)
      // sender: 20 bytes
      c.bitmask({
        shift: 32,
        mask: "0xffffffffffffffffffff",
        value: contracts.gnosis.xdai_bridge.slice(0, 22), // First 10 bytes of the sender address (XDAI Bridge)
      }),
      c.bitmask({
        shift: 32 + 10,
        mask: "0xffffffffffffffffffff",
        value: "0x" + contracts.gnosis.xdai_bridge.slice(22, 42), // Second 10 bytes of the sender address (XDAI Bridge)
      }),
      // executor: 20 bytes
      c.bitmask({
        shift: 32 + 20,
        mask: "0xffffffffffffffffffff",
        value: contracts.mainnet.gno_omnibridge.slice(0, 22), // First 10 bytes of the executor address (Omnibridge)
      }),
      c.bitmask({
        shift: 32 + 20 + 10,
        mask: "0xffffffffffffffffffff",
        value: "0x" + contracts.mainnet.gno_omnibridge.slice(22, 42), // Second 10 bytes of the executor address (Omnibridge)
      }),
      // gasLimit: 4 bytes
      c.bitmask({
        shift: 32 + 20 + 20,
        mask: "0xffffffff",
        value: "0x000927c0",
      }),
      // dataType + chainIds: 5 bytes
      c.bitmask({
        shift: 32 + 20 + 20 + 4,
        mask: "0xffffffffff",
        value: "0x0101806401",
      }),
      // selector (handleNativeTokens): 4 bytes
      c.bitmask({
        shift: 32 + 20 + 20 + 4 + 5,
        mask: "0xffffffff",
        value: "0x272255bb",
      }),
      // skip the first 12 bytes (0's) of the address and scope the first 10 bytes
      // Token address
      c.bitmask({
        shift: 32 + 20 + 20 + 4 + 5 + 4 + 12,
        mask: "0xffffffffffffffffffff",
        value: USDC.slice(0, 22), // First 10 bytes of the token address
      }),
      c.bitmask({
        shift: 32 + 20 + 20 + 4 + 5 + 4 + 12 + 10,
        mask: "0xffffffffffffffffffff",
        value: "0x" + USDC.slice(22, 42), // Last 10 bytes of the token address
      }),
      // skip the first 12 bytes (0's) of the address and scope the first 10 bytes
      // Avatar address
      c.bitmask({
        shift: 32 + 20 + 20 + 4 + 5 + 4 + 32 + 12,
        mask: "0xffffffffffffffffffff",
        value: avatar.slice(0, 22), // First 10 bytes of the avatar address
      }),
      c.bitmask({
        shift: 32 + 20 + 20 + 4 + 5 + 4 + 32 + 12 + 10,
        mask: "0xffffffffffffffffffff",
        value: "0x" + avatar.slice(22, 42), // Last 10 bytes of the avatar address
      })
    )
  ),
  // HOP does not work with USDC and USDC.e
  // USDC (Mainnet) -> USDC (Gnosis) - Connext
  // The xcall() function was added manually in the contracts' ABI
  // Implementation: 0x3606b0D9c84224892C7407d4e8DCfd7E9E2126A2
  ...allowErc20Approve([USDC], [contracts.mainnet.connext_bridge]),
  // To get the Domain ID: https://docs.connext.network/resources/deployments
  // Mainnet: 6648936
  // Optimism: 1869640809
  // Arbitrum: 1634886255
  // Gnosis: 6778479
  // Base: 1650553709
  allow.mainnet.connext_bridge[
    "xcall(uint32,address,address,address,uint256,uint256,bytes,uint256)"
  ](6778479, c.avatar, USDC, c.avatar, undefined, undefined, "0x"),

  // Mainnet -> Optimism
  // DAI (Mainnet) -> DAI (Optimism)
  ...allowErc20Approve([DAI], [contracts.mainnet.opt_dai_bridge]),
  allow.mainnet.opt_dai_bridge.depositERC20(DAI, DAI_opt),
  allow.mainnet.opt_dai_bridge.depositERC20To(DAI, DAI_opt, c.avatar),
  // DAI (Mainnet) -> DAI (Optimism) - HOP
  ...allowErc20Approve([DAI], [contracts.mainnet.hop_dai_bridge]),
  allow.mainnet.hop_dai_bridge.sendToL2(
    10, // Optimism
    c.avatar,
    undefined,
    undefined,
    undefined,
    "0x9298dfD8A0384da62643c2E98f437E820029E75E" // Relayer
  ),
  // DAI (Mainnet) -> DAI (Optimism) - Connext
  // The xcall() function was added manually in the contracts' ABI
  // Implementation: 0x3606b0D9c84224892C7407d4e8DCfd7E9E2126A2
  ...allowErc20Approve([DAI], [contracts.mainnet.connext_bridge]),
  // To get the Domain ID: https://docs.connext.network/resources/deployments
  // Mainnet: 6648936
  // Optimism: 1869640809
  // Arbitrum: 1634886255
  // Gnosis: 6778479
  // Base: 1650553709
  allow.mainnet.connext_bridge[
    "xcall(uint32,address,address,address,uint256,uint256,bytes)"
  ](1869640809, c.avatar, DAI, c.avatar, undefined, undefined, "0x", {
    send: true,
  }),
  // COMP (Mainnet) -> COMP (Optimism)
  ...allowErc20Approve([COMP], [contracts.mainnet.opt_gateway]),
  allow.mainnet.opt_gateway.depositERC20(COMP, COMP_opt),
  allow.mainnet.opt_gateway.depositERC20To(COMP, COMP_opt, c.avatar),
  // USDC (Mainnet) -> USDC (Optimism)
  ...allowErc20Approve([USDC], [contracts.mainnet.circle_token_messenger]),
  allow.mainnet.circle_token_messenger.depositForBurn(
    undefined,
    2,
    "0x" + avatar.slice(2).padStart(64, "0"),
    USDC
  ),
  // Claim bridged USDC from Optimism
  allow.mainnet.circle_message_transmitter.receiveMessage(
    c.and(
      // version: 4 bytes (00000000)
      // source domain: 4 bytes(00000002)
      // destination domain: 4 bytes (00000000)
      c.bitmask({
        shift: 0,
        mask: "0xffffffffffffffffffffffff",
        value: "0x000000000000000200000000",
      }),
      // skip nonce 8 bytes
      // sender: 32 bytes
      // skip the first 12 bytes of the address with 0's
      // Circle Token Messenger (Optimism)
      c.bitmask({
        shift: 20 + 12,
        mask: "0xffffffffffffffffffff",
        value: contracts.optimism.circle_token_messenger.slice(0, 22),
      }),
      c.bitmask({
        shift: 20 + 12 + 10,
        mask: "0xffffffffffffffffffff",
        value: "0x" + contracts.optimism.circle_token_messenger.slice(22, 42),
      }),
      // recipient: 32 bytes
      // skip the first 12 bytes of the address with 0's
      // Circle Token Messenger (Mainnet)
      c.bitmask({
        shift: 20 + 32 + 12,
        mask: "0xffffffffffffffffffff",
        value: contracts.mainnet.circle_token_messenger.slice(0, 22),
      }),
      c.bitmask({
        shift: 20 + 32 + 12 + 10,
        mask: "0xffffffffffffffffffff",
        value: "0x" + contracts.mainnet.circle_token_messenger.slice(22, 42),
      }),
      // message body: dynamic
      // skip selector (4 bytes) + 32 bytes chunk with 0
      // Bridged Token: USDC
      // skip the first 12 bytes of the address with 0's
      c.bitmask({
        shift: 20 + 32 + 32 + 36 + 12,
        mask: "0xffffffffffffffffffff",
        value: USDC_opt.slice(0, 22),
      }),
      c.bitmask({
        shift: 20 + 32 + 32 + 36 + 12 + 10,
        mask: "0xffffffffffffffffffff",
        value: "0x" + USDC_opt.slice(22, 42),
      }),
      // Avatar address
      // skip the first 12 bytes (0's) of the address and scope the first 10 bytes
      c.bitmask({
        shift: 20 + 32 + 32 + 36 + 32 + 12,
        mask: "0xffffffffffffffffffff",
        value: avatar.slice(0, 22), // First 10 bytes of the avatar address
      }),
      c.bitmask({
        shift: 20 + 32 + 32 + 36 + 32 + 12 + 10,
        mask: "0xffffffffffffffffffff",
        value: "0x" + avatar.slice(22, 42), // Last 10 bytes of the avatar address
      }),
      // skip 32 bytes chunk with 0
      // skip the first 12 bytes (0's) of the address and scope the first 10 bytes
      // Avatar address
      c.bitmask({
        shift: 20 + 32 + 32 + 36 + 32 + 32 + 32 + 12,
        mask: "0xffffffffffffffffffff",
        value: avatar.slice(0, 22), // First 10 bytes of the avatar address
      }),
      c.bitmask({
        shift: 20 + 32 + 32 + 36 + 32 + 32 + 32 + 12 + 10,
        mask: "0xffffffffffffffffffff",
        value: "0x" + avatar.slice(22, 42), // Last 10 bytes of the avatar address
      })
    )
  ),
  // USDC (Mainnet) -> USDC (Optimism) - HOP
  ...allowErc20Approve([USDC], [contracts.mainnet.l1_hop_cctp]),
  allow.mainnet.l1_hop_cctp.send(
    10, // Optimism
    c.avatar
  ),
  // USDC (Mainnet) -> USDC.e (Optimism) - Connext
  // The xcall() function was added manually in the contracts' ABI
  // Implementation: 0x3606b0D9c84224892C7407d4e8DCfd7E9E2126A2
  ...allowErc20Approve([USDC], [contracts.mainnet.connext_bridge]),
  // To get the Domain ID: https://docs.connext.network/resources/deployments
  // Mainnet: 6648936
  // Optimism: 1869640809
  // Arbitrum: 1634886255
  // Gnosis: 6778479
  // Base: 1650553709
  allow.mainnet.connext_bridge[
    "xcall(uint32,address,address,address,uint256,uint256,bytes,uint256)"
  ](1869640809, c.avatar, USDC, c.avatar, undefined, undefined, "0x"),

  // Mainnet -> Arbitrum
  // DAI (Mainnet) -> DAI (Arbitrum)
  ...allowErc20Approve([DAI], [contracts.mainnet.arb_dai_gateway]),
  allow.mainnet.arb_dai_gateway.outboundTransfer(DAI, c.avatar),
  // DAI (Mainnet) -> DAI (Arbitrum) - HOP
  ...allowErc20Approve([DAI], [contracts.mainnet.hop_dai_bridge]),
  allow.mainnet.hop_dai_bridge.sendToL2(
    42161, // Arbitrum
    c.avatar,
    undefined,
    undefined,
    undefined,
    "0x9298dfD8A0384da62643c2E98f437E820029E75E" // Relayer
  ),
  // DAI (Mainnet) -> DAI (Arbitrum) - Connext
  // The xcall() function was added manually in the contracts' ABI
  // Implementation: 0x3606b0D9c84224892C7407d4e8DCfd7E9E2126A2
  ...allowErc20Approve([DAI], [contracts.mainnet.connext_bridge]),
  // To get the Domain ID: https://docs.connext.network/resources/deployments
  // Mainnet: 6648936
  // Optimism: 1869640809
  // Arbitrum: 1634886255
  // Gnosis: 6778479
  // Base: 1650553709
  allow.mainnet.connext_bridge[
    "xcall(uint32,address,address,address,uint256,uint256,bytes)"
  ](1634886255, c.avatar, DAI, c.avatar, undefined, undefined, "0x", {
    send: true,
  }),
  // COMP (Mainnet) -> COMP (Arbitrum)
  ...allowErc20Approve([COMP], [contracts.mainnet.arb_erc20_gateway]),
  allow.mainnet.arb_erc20_gateway.outboundTransfer(COMP, c.avatar),
  // USDC (Mainnet) -> USDC (Arbitrum)
  // USDC approval already included
  allow.mainnet.circle_token_messenger.depositForBurn(
    undefined,
    3,
    "0x" + avatar.slice(2).padStart(64, "0"),
    USDC
  ),
  // Claim bridged USDC from Arbitrum
  allow.mainnet.circle_message_transmitter.receiveMessage(
    c.and(
      // version: 4 bytes (00000000)
      // source domain: 4 bytes(00000003)
      // destination domain: 4 bytes (00000000)
      c.bitmask({
        shift: 0,
        mask: "0xffffffffffffffffffffffff",
        value: "0x000000000000000300000000",
      }),
      // skip nonce 8 bytes
      // sender: 32 bytes
      // skip the first 12 bytes of the address with 0's
      // Circle Token Messenger (Arbitrum)
      c.bitmask({
        shift: 20 + 12,
        mask: "0xffffffffffffffffffff",
        value: contracts.arbitrumOne.circle_token_messenger.slice(0, 22),
      }),
      c.bitmask({
        shift: 20 + 12 + 10,
        mask: "0xffffffffffffffffffff",
        value:
          "0x" + contracts.arbitrumOne.circle_token_messenger.slice(22, 42),
      }),
      // recipient: 32 bytes
      // skip the first 12 bytes of the address with 0's
      // Circle Token Messenger (Mainnet)
      c.bitmask({
        shift: 20 + 32 + 12,
        mask: "0xffffffffffffffffffff",
        value: contracts.mainnet.circle_token_messenger.slice(0, 22),
      }),
      c.bitmask({
        shift: 20 + 32 + 12 + 10,
        mask: "0xffffffffffffffffffff",
        value: "0x" + contracts.mainnet.circle_token_messenger.slice(22, 42),
      }),
      // message body: dynamic
      // skip selector (4 bytes) + 32 bytes chunk with 0
      // Bridged Token: USDC
      // skip the first 12 bytes of the address with 0's
      c.bitmask({
        shift: 20 + 32 + 32 + 36 + 12,
        mask: "0xffffffffffffffffffff",
        value: USDC_arb.slice(0, 22),
      }),
      c.bitmask({
        shift: 20 + 32 + 32 + 36 + 12 + 10,
        mask: "0xffffffffffffffffffff",
        value: "0x" + USDC_arb.slice(22, 42),
      }),
      // Avatar address
      // skip the first 12 bytes (0's) of the address and scope the first 10 bytes
      c.bitmask({
        shift: 20 + 32 + 32 + 36 + 32 + 12,
        mask: "0xffffffffffffffffffff",
        value: avatar.slice(0, 22), // First 10 bytes of the avatar address
      }),
      c.bitmask({
        shift: 20 + 32 + 32 + 36 + 32 + 12 + 10,
        mask: "0xffffffffffffffffffff",
        value: "0x" + avatar.slice(22, 42), // Last 10 bytes of the avatar address
      }),
      // skip 32 bytes chunk with 0
      // skip the first 12 bytes (0's) of the address and scope the first 10 bytes
      // Avatar address
      c.bitmask({
        shift: 20 + 32 + 32 + 36 + 32 + 32 + 32 + 12,
        mask: "0xffffffffffffffffffff",
        value: avatar.slice(0, 22), // First 10 bytes of the avatar address
      }),
      c.bitmask({
        shift: 20 + 32 + 32 + 36 + 32 + 32 + 32 + 12 + 10,
        mask: "0xffffffffffffffffffff",
        value: "0x" + avatar.slice(22, 42), // Last 10 bytes of the avatar address
      })
    )
  ),
  // USDC (Mainnet) -> USDC (Arbitrum) - HOP
  ...allowErc20Approve([USDC], [contracts.mainnet.l1_hop_cctp]),
  allow.mainnet.l1_hop_cctp.send(
    42161, // Arbitrum
    c.avatar
  ),
  // USDC (Mainnet) -> USDC.e (Arbitrum) - Connext
  // The xcall() function was added manually in the contracts' ABI
  // Implementation: 0x3606b0D9c84224892C7407d4e8DCfd7E9E2126A2
  ...allowErc20Approve([USDC], [contracts.mainnet.connext_bridge]),
  // To get the Domain ID: https://docs.connext.network/resources/deployments
  // Mainnet: 6648936
  // Optimism: 1869640809
  // Arbitrum: 1634886255
  // Gnosis: 6778479
  // Base: 1650553709
  allow.mainnet.connext_bridge[
    "xcall(uint32,address,address,address,uint256,uint256,bytes,uint256)"
  ](1634886255, c.avatar, USDC, c.avatar, undefined, undefined, "0x"),

  // Mainnet -> Base
  // USDC (Mainnet) -> USDC (Base)
  // USDC approval already included
  allow.mainnet.circle_token_messenger.depositForBurn(
    undefined,
    6,
    "0x" + avatar.slice(2).padStart(64, "0"),
    USDC
  ),
  // Claim bridged USDC from Base
  allow.mainnet.circle_message_transmitter.receiveMessage(
    c.and(
      // version: 4 bytes (00000000)
      // source domain: 4 bytes(00000006)
      // destination domain: 4 bytes (00000000)
      c.bitmask({
        shift: 0,
        mask: "0xffffffffffffffffffffffff",
        value: "0x000000000000000600000000",
      }),
      // skip nonce 8 bytes
      // sender: 32 bytes
      // skip the first 12 bytes of the address with 0's
      // Circle Token Messenger (Base)
      c.bitmask({
        shift: 20 + 12,
        mask: "0xffffffffffffffffffff",
        value: contracts.base.circle_token_messenger.slice(0, 22),
      }),
      c.bitmask({
        shift: 20 + 12 + 10,
        mask: "0xffffffffffffffffffff",
        value: "0x" + contracts.base.circle_token_messenger.slice(22, 42),
      }),
      // recipient: 32 bytes
      // skip the first 12 bytes of the address with 0's
      // Circle Token Messenger (Mainnet)
      c.bitmask({
        shift: 20 + 32 + 12,
        mask: "0xffffffffffffffffffff",
        value: contracts.mainnet.circle_token_messenger.slice(0, 22),
      }),
      c.bitmask({
        shift: 20 + 32 + 12 + 10,
        mask: "0xffffffffffffffffffff",
        value: "0x" + contracts.mainnet.circle_token_messenger.slice(22, 42),
      }),
      // message body: dynamic
      // skip selector (4 bytes) + 32 bytes chunk with 0
      // Bridged Token: USDC
      // skip the first 12 bytes of the address with 0's
      c.bitmask({
        shift: 20 + 32 + 32 + 36 + 12,
        mask: "0xffffffffffffffffffff",
        value: USDC_base.slice(0, 22),
      }),
      c.bitmask({
        shift: 20 + 32 + 32 + 36 + 12 + 10,
        mask: "0xffffffffffffffffffff",
        value: "0x" + USDC_base.slice(22, 42),
      }),
      // Avatar address
      // skip the first 12 bytes (0's) of the address and scope the first 10 bytes
      c.bitmask({
        shift: 20 + 32 + 32 + 36 + 32 + 12,
        mask: "0xffffffffffffffffffff",
        value: avatar.slice(0, 22), // First 10 bytes of the avatar address
      }),
      c.bitmask({
        shift: 20 + 32 + 32 + 36 + 32 + 12 + 10,
        mask: "0xffffffffffffffffffff",
        value: "0x" + avatar.slice(22, 42), // Last 10 bytes of the avatar address
      }),
      // skip 32 bytes chunk with 0
      // skip the first 12 bytes (0's) of the address and scope the first 10 bytes
      // Avatar address
      c.bitmask({
        shift: 20 + 32 + 32 + 36 + 32 + 32 + 32 + 12,
        mask: "0xffffffffffffffffffff",
        value: avatar.slice(0, 22), // First 10 bytes of the avatar address
      }),
      c.bitmask({
        shift: 20 + 32 + 32 + 36 + 32 + 32 + 32 + 12 + 10,
        mask: "0xffffffffffffffffffff",
        value: "0x" + avatar.slice(22, 42), // Last 10 bytes of the avatar address
      })
    )
  ),
  // USDC (Mainnet) -> USDC (Base) - HOP
  ...allowErc20Approve([USDC], [contracts.mainnet.l1_hop_cctp]),
  allow.mainnet.l1_hop_cctp.send(
    8453, // Base
    c.avatar
  ),
  // USDC (Mainnet) -> USDC (Base) - Connext
  // The xcall() function was added manually in the contracts' ABI
  // Implementation: 0x3606b0D9c84224892C7407d4e8DCfd7E9E2126A2
  ...allowErc20Approve([USDC], [contracts.mainnet.connext_bridge]),
  // To get the Domain ID: https://docs.connext.network/resources/deployments
  // Mainnet: 6648936
  // Optimism: 1869640809
  // Arbitrum: 1634886255
  // Gnosis: 6778479
  // Base: 1650553709
  allow.mainnet.connext_bridge[
    "xcall(uint32,address,address,address,uint256,uint256,bytes,uint256)"
  ](1650553709, c.avatar, USDC, c.avatar, undefined, undefined, "0x"),
] satisfies PermissionList
