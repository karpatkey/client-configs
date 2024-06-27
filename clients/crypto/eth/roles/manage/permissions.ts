import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import { allow as allowAction } from "defi-kit/eth"
import {
  COMP,
  DAI,
  sDAI,
  USDC,
  WBTC,
  wstETH,
  morpho,
} from "../../../../../eth-sdk/addresses"
import {
  DAI as DAI_opt,
  COMP as COMP_opt,
} from "../../../../../eth-sdk/addresses_opt"
import { contracts } from "../../../../../eth-sdk/config"
import { allowErc20Approve } from "../../../../../utils/erc20"
import { PermissionList } from "../../../../../types"
import { avatar as avatar_gno } from "../../../gno/index"
import { avatar as avatar_opt } from "../../../opt/index"
import { avatar as avatar_arb } from "../../../arb/index"

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

  /*********************************************
   * Typed-presets permissions
   *********************************************/
  // Compound v3 - USDC
  ...allowErc20Approve([USDC], [contracts.mainnet.compound_v3.cUSDCv3]),
  allow.mainnet.compound_v3.cUSDCv3.supply(USDC),
  allow.mainnet.compound_v3.cUSDCv3.withdraw(USDC),

  // Curve - 3pool - Swap DAI <-> USDC
  ...allowErc20Approve([DAI, USDC], [contracts.mainnet.curve.x3CRV_pool]),
  allow.mainnet.curve.x3CRV_pool.exchange(
    c.or(0, 1), // 0 = DAI, 1 = USDC
    c.or(0, 1)
  ),

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

  // Bridge - Mainnet -> Gnosis
  // DAI -> XDAI
  ...allowErc20Approve([DAI], [contracts.mainnet.gno_xdai_bridge]),
  allow.mainnet.gno_xdai_bridge.relayTokens(avatar_gno, undefined),
  // COMP (Mainnet) -> COMP (Gnosis)
  ...allowErc20Approve([COMP], [contracts.mainnet.gno_omnibridge]),
  allow.mainnet.gno_omnibridge["relayTokens(address,address,uint256)"](
    COMP,
    avatar_gno
  ),
  // USDC (Mainnet) -> USDC (Gnosis)
  ...allowErc20Approve([USDC], [contracts.mainnet.gno_omnibridge]),
  allow.mainnet.gno_omnibridge["relayTokens(address,address,uint256)"](
    USDC,
    avatar_gno
  ),
  // USDC (Mainnet) -> USDC.e (Gnosis)
  // USDC approval already included
  allow.mainnet.gno_omnibridge.relayTokensAndCall(
    USDC,
    "0x0392A2F5Ac47388945D8c84212469F545fAE52B2",
    undefined,
    "0x" + avatar_gno.slice(2).padStart(64, "0")
  ),

  // Bridge - Mainnet -> Optimism
  // DAI (Mainnet) -> DAI (Optimism)
  ...allowErc20Approve([DAI], [contracts.mainnet.opt_dai_bridge]),
  allow.mainnet.opt_dai_bridge.depositERC20(DAI, DAI_opt),
  allow.mainnet.opt_dai_bridge.depositERC20To(DAI, DAI_opt, avatar_opt),
  // COMP (Mainnet) -> COMP (Optimism)
  ...allowErc20Approve([COMP], [contracts.mainnet.opt_gateway]),
  allow.mainnet.opt_gateway.depositERC20(COMP, COMP_opt),
  allow.mainnet.opt_gateway.depositERC20To(COMP, COMP_opt, avatar_opt),
  // USDC (Mainnet) -> USDC (Optimism)
  ...allowErc20Approve([USDC], [contracts.mainnet.circle_token_messenger]),
  allow.mainnet.circle_token_messenger.depositForBurn(
    undefined,
    2,
    "0x" + avatar_opt.slice(2).padStart(64, "0"),
    USDC
  ),

  // Bridge - Mainnet -> Arbitrum
  // DAI (Mainnet) -> DAI (Arbitrum)
  ...allowErc20Approve([DAI], [contracts.mainnet.arb_dai_gateway]),
  allow.mainnet.arb_dai_gateway.outboundTransfer(DAI, avatar_arb),
  // COMP (Mainnet) -> COMP (Arbitrum)
  ...allowErc20Approve([COMP], [contracts.mainnet.arb_erc20_gateway]),
  allow.mainnet.arb_erc20_gateway.outboundTransfer(COMP, avatar_arb),
  // USDC (Mainnet) -> USDC (Arbitrum)
  // USDC approval already included
  allow.mainnet.circle_token_messenger.depositForBurn(
    undefined,
    3,
    "0x" + avatar_opt.slice(2).padStart(64, "0"),
    USDC
  ),
] satisfies PermissionList
