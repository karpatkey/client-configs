import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import { allow as allowAction } from "defi-kit/gno"
import {
  COW,
  GNO,
  OLAS,
  sDAI,
  WETH,
  wstETH,
} from "../../../../../eth-sdk/addresses_gno"
import { contracts } from "../../../../../eth-sdk/config"
import { allowErc20Approve } from "../../../../../utils/erc20"
import { PermissionList } from "../../../../../types"
import { avatar } from "../../index"

export default [
  /*********************************************
   * Defi-Kit permissions
   *********************************************/
  // Aave v3 - Deposit XDAI
  allowAction.aave_v3.deposit({ targets: ["XDAI"] }),
  // Aave v3 - Deposit WXDAI
  allowAction.aave_v3.deposit({ targets: ["WXDAI"] }),
  // Aave v3 - Deposit wstETH
  allowAction.aave_v3.deposit({ targets: ["wstETH"] }),
  // Aave v3 - Deposit WETH
  allowAction.aave_v3.deposit({ targets: ["WETH"] }),
  // Aave v3 - Deposit USDC
  allowAction.aave_v3.deposit({ targets: ["USDC"] }),
  // Aave v3 - Deposit EURe
  allowAction.aave_v3.deposit({ targets: ["EURe"] }),
  // Aave v3 - Deposit GNO
  allowAction.aave_v3.deposit({ targets: ["GNO"] }),
  // Aave v3 - Deposit USDC.e
  allowAction.aave_v3.deposit({ targets: ["USDC.e"] }),

  // Aura - WETH/wstETH
  allowAction.aura.deposit({ targets: ["0"] }),
  // Aura - EURe/sDAI
  allowAction.aura.deposit({ targets: ["18"] }),
  // Aura - Gyroscope ECLP rETH/WETH
  allowAction.aura.deposit({ targets: ["26"] }),

  // Balancer - wstETH/GNO
  allowAction.balancer.deposit({ targets: ["B-50wstETH-50GNO"] }),
  allowAction.balancer.stake({ targets: ["B-50wstETH-50GNO"] }),
  // Balancer - sDAI/wstETH
  allowAction.balancer.deposit({ targets: ["B-50sDAI-50wstETH"] }),
  allowAction.balancer.stake({ targets: ["B-50sDAI-50wstETH"] }),
  // Balancer - USDC.e/USDT/sDAI
  allowAction.balancer.deposit({ targets: ["sBAL3"] }),
  allowAction.balancer.stake({ targets: ["sBAL3"] }),
  // Balancer - WETH/wstETH
  allowAction.balancer.deposit({ targets: ["bb-WETH-wstETH"] }),
  allowAction.balancer.stake({ targets: ["bb-WETH-wstETH"] }),
  // Balancer - rETH/WETH
  allowAction.balancer.deposit({ targets: ["ECLP-rETH-WETH"] }),
  allowAction.balancer.stake({ targets: ["ECLP-rETH-WETH"] }),
  // Balancer - osGNO/GNO
  allowAction.balancer.deposit({ targets: ["osGNO/GNO-BPT"] }),
  allowAction.balancer.stake({ targets: ["osGNO/GNO-BPT"] }),
  // Balancer - WBTC/WETH
  allowAction.balancer.deposit({ targets: ["50WBTC-50WETH"] }),
  allowAction.balancer.stake({ targets: ["50WBTC-50WETH"] }),
  // Balancer - Gyroscope ECLP wstETH/WETH
  allowAction.balancer.deposit({ targets: ["ECLP-wstETH-WETH"] }),
  allowAction.balancer.stake({ targets: ["ECLP-wstETH-WETH"] }),
  // Balancer - wstETH/BAL/AURA
  allowAction.balancer.deposit({ targets: ["B-50wstETH-25BAL-25AURA"] }),
  allowAction.balancer.stake({ targets: ["B-50wstETH-25BAL-25AURA"] }),
  // Balancer - wstETH/COW
  allowAction.balancer.deposit({ targets: ["B-50wstETH-50COW"] }),
  allowAction.balancer.stake({ targets: ["B-50wstETH-50COW"] }),
  // Balancer - COW/GNO
  allowAction.balancer.deposit({ targets: ["50COW-50GNO"] }),
  allowAction.balancer.stake({ targets: ["50COW-50GNO"] }),
  // Balancer - stEUR/EURe
  allowAction.balancer.deposit({ targets: ["stEUR/EURe"] }),
  allowAction.balancer.stake({ targets: ["stEUR/EURe"] }),
  // Balancer - GIV/GNO
  allowAction.balancer.deposit({ targets: ["50GIV-50GNO"] }),
  allowAction.balancer.stake({ targets: ["50GIV-50GNO"] }),
  // Balancer - WXDAI/GNO
  allowAction.balancer.deposit({ targets: ["WXDAI-GNO"] }),
  allowAction.balancer.stake({ targets: ["WXDAI-GNO"] }),

  // Spark - GNO
  allowAction.spark.deposit({ targets: ["GNO"] }),
  // Spark - XDAI
  allowAction.spark.deposit({ targets: ["XDAI"] }),
  // Spark - WXDAI
  allowAction.spark.deposit({ targets: ["WXDAI"] }),
  // Spark - WETH
  allowAction.spark.deposit({ targets: ["WETH"] }),
  // Spark - USDC.e
  allowAction.spark.deposit({ targets: ["USDC.e"] }),
  // Spark - EURe
  allowAction.spark.deposit({ targets: ["EURe"] }),
  // Spark - USDT
  allowAction.spark.deposit({ targets: ["USDT"] }),
  // Spark - USDC
  allowAction.spark.deposit({ targets: ["USDC"] }),

  /*********************************************
   * Typed-presets permissions
   *********************************************/
  // Balancer - BCoW AMM WETH/GNO (Staking not available)
  ...allowErc20Approve(
    [GNO, WETH],
    [contracts.gnosis.balancer.BCoW_AMM_50WETH_50GNO]
  ),
  allow.gnosis.balancer.BCoW_AMM_50WETH_50GNO.joinPool(),
  allow.gnosis.balancer.BCoW_AMM_50WETH_50GNO.exitPool(),

  // Balancer - BCoW AMM wstETH/sDAI (Staking not available)
  ...allowErc20Approve(
    [sDAI, wstETH],
    [contracts.gnosis.balancer.BCoW_AMM_50wstETH_50sDAI]
  ),
  allow.gnosis.balancer.BCoW_AMM_50wstETH_50sDAI.joinPool(),
  allow.gnosis.balancer.BCoW_AMM_50wstETH_50sDAI.exitPool(),

  // Balancer - BCoW AMM GNO/OLAS (Staking not available)
  ...allowErc20Approve(
    [GNO, OLAS],
    [contracts.gnosis.balancer.BCoW_AMM_50GNO_50OLAS]
  ),
  allow.gnosis.balancer.BCoW_AMM_50GNO_50OLAS.joinPool(),
  allow.gnosis.balancer.BCoW_AMM_50GNO_50OLAS.exitPool(),

  // Balancer - BCoW AMM GNO/COW (Staking not available)
  ...allowErc20Approve(
    [GNO, COW],
    [contracts.gnosis.balancer.BCoW_AMM_50GNO_50COW]
  ),
  allow.gnosis.balancer.BCoW_AMM_50GNO_50COW.joinPool(),
  allow.gnosis.balancer.BCoW_AMM_50GNO_50COW.exitPool(),
] satisfies PermissionList
