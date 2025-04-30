import { allow } from "zodiac-roles-sdk/kit"
import {
  GNO,
  osGNO,
  rETH,
  SAFE,
  USDC,
  USDCe,
  WETH,
  wstETH,
  balancerV2,
} from "@/addresses/gno"
import { contracts } from "@/contracts"
import { allowErc20Approve } from "@/helpers"
import { PermissionList } from "@/types"
import { c } from "zodiac-roles-sdk"
import { Parameters } from "../../../parameters"
import { balancerV2Swap } from "@/exit_strategies/balancerV2"

export default (parameters: Parameters) =>
  [
    // Wrapping and unwrapping of XDAI, WXDAI
    allow.gnosis.wxdai.deposit({ send: true }),
    allow.gnosis.wxdai.withdraw(),

    // Balancer v2 - BCoW 50GNO/50SAFE (Staking not available)
    ...allowErc20Approve(
      [GNO, SAFE],
      [contracts.gnosis.balancerV2.bCow50Gno50Safe]
    ),
    allow.gnosis.balancerV2.bCow50Gno50Safe.joinPool(),
    allow.gnosis.balancerV2.bCow50Gno50Safe.exitPool(),

    // Balancer v3 - Aave Lido Boosted WETH/wstETH
    ...allowErc20Approve([WETH, wstETH], [contracts.gnosis.uniswap.permit2]),
    allow.gnosis.uniswap.permit2.approve(
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
    ...allowErc20Approve([wstETH, GNO], [contracts.gnosis.uniswap.permit2]),
    allow.gnosis.uniswap.permit2.approve(
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

    /*********************************************
     * Swaps
     *********************************************/
    // Swap USDC.e -> USDC
    ...allowErc20Approve([USDCe], [contracts.gnosis.usdcTransmuter]),
    allow.gnosis.usdcTransmuter.withdraw(),
    // Swap USDC -> USDC.e
    ...allowErc20Approve([USDC], [contracts.gnosis.usdcTransmuter]),
    allow.gnosis.usdcTransmuter.deposit(),

    // Balancer v2 - WETH <-> wstETH - bb-WETH-wstETH
    balancerV2Swap(balancerV2.wethWstEthPid, [WETH, wstETH], [WETH, wstETH]),
    // Balancer v2 - WETH <-> wstETH - ECLP-wstETH-WETH
    balancerV2Swap(
      balancerV2.eclpWstEthWethPid,
      [WETH, wstETH],
      [WETH, wstETH]
    ),
    // Balancer v2 - rETH <-> WETH - ECLP-rETH-WETH
    balancerV2Swap(balancerV2.eclpRethWethPid, [rETH, WETH], [rETH, WETH]),
    // Balancer v2 - GNO <-> SAFE - 50SAFE-50GNO
    balancerV2Swap(balancerV2.b50Safe50GnoPid, [GNO, SAFE], [GNO, SAFE]),
    // Balancer v2 - GNO <-> WETH - 50WETH-50GNO
    balancerV2Swap(balancerV2.b50Weth50GnoPid, [GNO, WETH], [GNO, WETH]),
    // Balancer v2 - GNO <-> osGNO - osGNO/GNO-BPT
    balancerV2Swap(balancerV2.osGnoGnoPid, [GNO, osGNO], [GNO, osGNO]),
    // Balancer v2 - GNO <-> wstETH - B-50wstETH-50GNO
    balancerV2Swap(balancerV2.b50WstEth50Gno, [GNO, wstETH], [GNO, wstETH]),

    /*********************************************
     * Bridge
     *********************************************/
    // NAV Calculator - bridgeStart - In the future, the bridged assets should be scoped appropriately.
    allow.gnosis.navCalculator.bridgeStart(),

    // Gnosis -> Mainnet
    // XDAI (Gnosis) -> DAI (Mainnet) - Gnosis Bridge
    allow.gnosis.xdaiBridge2.relayTokens(c.avatar, {
      send: true,
    }),

    // GNO (Gnosis) -> GNO (Mainnet) - Gnosis Bridge
    allow.gnosis.gno.transferAndCall(
      contracts.gnosis.xdaiBridge,
      undefined,
      parameters.avatar
    ),

    // SAFE (Gnosis) -> SAFE (Mainnet) - Gnosis Bridge
    {
      ...allow.gnosis.gno.transferAndCall(
        contracts.gnosis.xdaiBridge,
        undefined,
        parameters.avatar
      ),
      targetAddress: SAFE,
    },

    // USDC (Gnosis) -> USDC (Mainnet) - Gnosis Bridge
    allow.gnosis.usdc.transferAndCall(
      contracts.gnosis.xdaiBridge,
      undefined,
      parameters.avatar
    ),

    // WETH (Gnosis) -> WETH (Mainnet) - Gnosis Bridge
    {
      ...allow.gnosis.gno.transferAndCall(
        contracts.gnosis.xdaiBridge,
        undefined,
        parameters.avatar
      ),
      targetAddress: WETH,
    },
  ] satisfies PermissionList
