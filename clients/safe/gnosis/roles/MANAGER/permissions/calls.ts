import { allow } from "zodiac-roles-sdk/kit"
import { GNO, SAFE, WETH, wstETH } from "@/addresses/gno"
import { contracts } from "@/contracts"
import { allowErc20Approve } from "@/helpers"
import { PermissionList } from "@/types"
import { c } from "zodiac-roles-sdk"

export default [
  /*********************************************
   * Typed-presets permissions
   *********************************************/
  // Balancer v2 - BCoW 50GNO/50SAFE (Staking not available)
  ...allowErc20Approve(
    [GNO, SAFE],
    [contracts.gnosis.balancerV2.bCow50Gno50Safe]
  ),
  allow.gnosis.balancerV2.bCow50Gno50Safe.joinPool(),
  allow.gnosis.balancerV2.bCow50Gno50Safe.exitPool(),

  // Wrapping and unwrapping of XDAI, WXDAI
  allow.gnosis.wxdai.deposit({ send: true }),
  allow.gnosis.wxdai.withdraw(),

  // Balancer v3 - Aave Lido Boosted WETH/wstETH
  ...allowErc20Approve([WETH, wstETH], [contracts.gnosis.arrakis.permit2]),
  allow.gnosis.arrakis.permit2.approve(
    c.or(WETH, wstETH),
    contracts.gnosis.balancerV3.compositeLiquidityRouter
  ),
  allow.gnosis.balancerV3.compositeLiquidityRouter.addLiquidityUnbalancedToERC4626Pool(
    contracts.gnosis.balancerV3.aaveLidoWethWstEth
  ),
  allow.gnosis.balancerV3.compositeLiquidityRouter.addLiquidityProportionalToERC4626Pool(
    contracts.gnosis.balancerV3.aaveLidoWethWstEth
  ),
  ...allowErc20Approve(
    [contracts.gnosis.balancerV3.aaveLidoWethWstEth],
    [contracts.gnosis.balancerV3.compositeLiquidityRouter]
  ),
  allow.gnosis.balancerV3.compositeLiquidityRouter.removeLiquidityProportionalFromERC4626Pool(
    contracts.gnosis.balancerV3.aaveLidoWethWstEth
  ),
  ...allowErc20Approve(
    [contracts.gnosis.balancerV3.aaveLidoWethWstEth],
    [contracts.gnosis.balancerV3.aaveLidoWethWstEthGauge]
  ),
  allow.gnosis.balancerV3.aaveLidoWethWstEthGauge["deposit(uint256)"](),
  allow.gnosis.balancerV3.aaveLidoWethWstEthGauge["withdraw(uint256)"](),
  allow.gnosis.balancerV3.aaveLidoWethWstEthGauge["claim_rewards()"](),
  allow.gnosis.balancerV2.minter.mint(
    contracts.gnosis.balancerV3.aaveLidoWethWstEth
  ),

  // Balancer v3 - Aave Lido Boosted 50waWstETH/50waGNO
  ...allowErc20Approve([wstETH, GNO], [contracts.gnosis.arrakis.permit2]),
  allow.gnosis.arrakis.permit2.approve(
    c.or(wstETH, GNO),
    contracts.gnosis.balancerV3.compositeLiquidityRouter
  ),
  allow.gnosis.balancerV3.compositeLiquidityRouter.addLiquidityUnbalancedToERC4626Pool(
    contracts.gnosis.balancerV3.aaveLido50WstEth50Gno
  ),
  allow.gnosis.balancerV3.compositeLiquidityRouter.addLiquidityProportionalToERC4626Pool(
    contracts.gnosis.balancerV3.aaveLido50WstEth50Gno
  ),
  ...allowErc20Approve(
    [contracts.gnosis.balancerV3.aaveLido50WstEth50Gno],
    [contracts.gnosis.balancerV3.compositeLiquidityRouter]
  ),
  allow.gnosis.balancerV3.compositeLiquidityRouter.removeLiquidityProportionalFromERC4626Pool(
    contracts.gnosis.balancerV3.aaveLido50WstEth50Gno
  ),
  ...allowErc20Approve(
    [contracts.gnosis.balancerV3.aaveLido50WstEth50Gno],
    [contracts.gnosis.balancerV3.aaveLido50WstEth50GnoGauge]
  ),
  allow.gnosis.balancerV3.aaveLido50WstEth50GnoGauge["deposit(uint256)"](),
  allow.gnosis.balancerV3.aaveLido50WstEth50GnoGauge["withdraw(uint256)"](),
  allow.gnosis.balancerV3.aaveLido50WstEth50GnoGauge["claim_rewards()"](),
  allow.gnosis.balancerV2.minter.mint(
    contracts.gnosis.balancerV3.aaveLido50WstEth50Gno
  ),
] satisfies PermissionList
