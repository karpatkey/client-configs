import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import {
  crvUSD,
  GHO,
  RLUSD,
  sUSDe,
  syrupUSDC,
  USDC,
  USDe,
  USDT,
  balancerV3,
  morpho,
  symbiotic,
} from "@/addresses/eth"
import { contracts } from "@/contracts"
import { allowErc20Approve } from "@/helpers"
import { PermissionList } from "@/types"
import { aaveV4BluechipReserve, aaveV4MainReserve } from "../../../addresses"
import { Parameters } from "../../../parameters"

const bluechipSpoke = contracts.mainnet.aaveV4.bluechipSpoke
const mainSpoke = contracts.mainnet.aaveV4.mainSpoke

export default (parameters: Parameters) =>
  [
    /*********************************************
     * Protocols
     *********************************************/

    // Aave v3 - sGHO (Savings GHO)
    allowErc20Approve([GHO], [contracts.mainnet.aaveV3.sGho]),
    allow.mainnet.aaveV3.sGho.deposit(undefined, c.avatar),
    allow.mainnet.aaveV3.sGho.withdraw(undefined, c.avatar, c.avatar),
    allow.mainnet.aaveV3.sGho.redeem(undefined, c.avatar, c.avatar),

    // Aave v4 - USDC supply only, on two pinned reserves: Bluechip Spoke reserve 4 (Prime Hub)
    // and Main Spoke reserve 7 (Core Hub), onBehalfOf pinned to the avatar. The Spoke pulls
    // USDC on supply, hence the approvals; withdraw pays the caller (the avatar). What stays
    // closed: borrow, repay, setUsingAsCollateral, every other reserve and Spoke, position
    // managers and multicall. Aave v4 is not in defi-kit, hence hand-scoped here (same pattern
    // as wbtc-carry-fund).
    allowErc20Approve([USDC], [bluechipSpoke, mainSpoke]),
    allow.mainnet.aaveV4.bluechipSpoke.supply(
      aaveV4BluechipReserve.usdcPrime,
      undefined,
      c.avatar
    ),
    allow.mainnet.aaveV4.bluechipSpoke.withdraw(
      aaveV4BluechipReserve.usdcPrime,
      undefined,
      c.avatar
    ),
    allow.mainnet.aaveV4.mainSpoke.supply(
      aaveV4MainReserve.usdcCore,
      undefined,
      c.avatar
    ),
    allow.mainnet.aaveV4.mainSpoke.withdraw(
      aaveV4MainReserve.usdcCore,
      undefined,
      c.avatar
    ),

    // Balancer v3 - Aave Boosted USDT/GHO/USDC
    allowErc20Approve([GHO, USDC, USDT], [contracts.mainnet.uniswap.permit2]),
    allow.mainnet.uniswap.permit2.approve(
      c.or(GHO, USDC, USDT),
      contracts.mainnet.balancerV3.compositeLiquidityRouter
    ),
    allow.mainnet.balancerV3.compositeLiquidityRouter.addLiquidityProportionalToERC4626Pool(
      balancerV3.aaveGhoUsdtUsdc
    ),
    allow.mainnet.balancerV3.compositeLiquidityRouter.addLiquidityUnbalancedToERC4626Pool(
      balancerV3.aaveGhoUsdtUsdc
    ),
    allowErc20Approve(
      [balancerV3.aaveGhoUsdtUsdc],
      [contracts.mainnet.balancerV3.compositeLiquidityRouter]
    ),
    allow.mainnet.balancerV3.compositeLiquidityRouter.removeLiquidityProportionalFromERC4626Pool(
      balancerV3.aaveGhoUsdtUsdc
    ),
    allowErc20Approve(
      [balancerV3.aaveGhoUsdtUsdc],
      [balancerV3.aaveGhoUsdtUsdcGauge]
    ),
    {
      ...allow.mainnet.balancerV2.gauge["deposit(uint256)"](),
      targetAddress: balancerV3.aaveGhoUsdtUsdcGauge,
    },
    {
      ...allow.mainnet.balancerV2.gauge["withdraw(uint256)"](),
      targetAddress: balancerV3.aaveGhoUsdtUsdcGauge,
    },
    {
      ...allow.mainnet.balancerV2.gauge["claim_rewards()"](),
      targetAddress: balancerV3.aaveGhoUsdtUsdcGauge,
    },

    // Curve - crvUSD/USDC
    allowErc20Approve([crvUSD, USDC], [contracts.mainnet.curve.crvUsdUsdcPool]),
    allow.mainnet.curve.crvUsdUsdcPool["add_liquidity(uint256[2],uint256)"](),
    allow.mainnet.curve.crvUsdUsdcPool[
      "remove_liquidity(uint256,uint256[2])"
    ](),
    allow.mainnet.curve.crvUsdUsdcPool[
      "remove_liquidity_imbalance(uint256[2],uint256)"
    ](),
    allow.mainnet.curve.crvUsdUsdcPool[
      "remove_liquidity_one_coin(uint256,int128,uint256)"
    ](),

    // Curve - crvUSD/USDT
    allowErc20Approve([crvUSD, USDT], [contracts.mainnet.curve.crvUsdUsdtPool]),
    allow.mainnet.curve.crvUsdUsdtPool["add_liquidity(uint256[2],uint256)"](),
    allow.mainnet.curve.crvUsdUsdtPool[
      "remove_liquidity(uint256,uint256[2])"
    ](),
    allow.mainnet.curve.crvUsdUsdtPool[
      "remove_liquidity_imbalance(uint256[2],uint256)"
    ](),
    allow.mainnet.curve.crvUsdUsdtPool[
      "remove_liquidity_one_coin(uint256,int128,uint256)"
    ](),

    // Curve - RLUSD/USDC
    allowErc20Approve([RLUSD, USDC], [contracts.mainnet.curve.rlUsdUsdcPool]),
    allow.mainnet.curve.rlUsdUsdcPool["add_liquidity(uint256[],uint256)"](),
    allow.mainnet.curve.rlUsdUsdcPool["remove_liquidity(uint256,uint256[])"](),
    allow.mainnet.curve.rlUsdUsdcPool[
      "remove_liquidity_imbalance(uint256[],uint256)"
    ](),
    allow.mainnet.curve.rlUsdUsdcPool[
      "remove_liquidity_one_coin(uint256,int128,uint256)"
    ](),

    // Ethena - Stake USDe
    allowErc20Approve([USDe], [sUSDe]),
    allow.mainnet.ethena.sUsde.deposit(undefined, c.avatar),
    // Ethena - Unstake USDe
    allow.mainnet.ethena.sUsde.cooldownShares(),
    allow.mainnet.ethena.sUsde.unstake(c.avatar),

    // Merkl - Rewards (max 4 tokens: aEthRLUSD, MORPHO, stkGHO and USDS)
    allow.mainnet.merkl.angleDistributor.claim(
      c.or(
        [parameters.avatar],
        [parameters.avatar, parameters.avatar],
        [parameters.avatar, parameters.avatar, parameters.avatar],
        [
          parameters.avatar,
          parameters.avatar,
          parameters.avatar,
          parameters.avatar,
        ]
      )
    ),

    // Morpho Vault - kpk USDC Yield RWA
    allowErc20Approve([USDC], [morpho.kpkUsdcYieldRWA]),
    {
      ...allow.mainnet.morpho.vault.deposit(undefined, c.avatar),
      targetAddress: morpho.kpkUsdcYieldRWA,
    },
    {
      ...allow.mainnet.morpho.vault.withdraw(undefined, c.avatar, c.avatar),
      targetAddress: morpho.kpkUsdcYieldRWA,
    },
    {
      ...allow.mainnet.morpho.vault.redeem(undefined, c.avatar, c.avatar),
      targetAddress: morpho.kpkUsdcYieldRWA,
    },
    // Morpho Vault - kpk YO Ecosystem
    allowErc20Approve([USDC], [morpho.kpkYoEcosystem]),
    {
      ...allow.mainnet.morpho.vault.deposit(undefined, c.avatar),
      targetAddress: morpho.kpkYoEcosystem,
    },
    {
      ...allow.mainnet.morpho.vault.withdraw(undefined, c.avatar, c.avatar),
      targetAddress: morpho.kpkYoEcosystem,
    },
    {
      ...allow.mainnet.morpho.vault.redeem(undefined, c.avatar, c.avatar),
      targetAddress: morpho.kpkYoEcosystem,
    },
    // Morpho Vault - kpk USDC Yield RWA / kpk USDC Yield v2 / kpk YO Ecosystem - Force deallocate (unlock liquidity
    // across the vault's underlying markets before a withdrawal) - onBehalf pinned to the avatar Safe
    {
      ...allow.mainnet.morpho.vault.forceDeallocate(
        undefined,
        undefined,
        undefined,
        c.avatar
      ),
      targetAddress: morpho.kpkUsdcYieldRWA,
    },
    {
      ...allow.mainnet.morpho.vault.forceDeallocate(
        undefined,
        undefined,
        undefined,
        c.avatar
      ),
      targetAddress: morpho.kpkUsdcYieldV2,
    },
    {
      ...allow.mainnet.morpho.vault.forceDeallocate(
        undefined,
        undefined,
        undefined,
        c.avatar
      ),
      targetAddress: morpho.kpkYoEcosystem,
    },

    // Symbiotic - KPK USDC LiquidLane (RWA Liquidity) - ERC-4626 vault, scoped via the generic
    // Morpho vault ABI + a targetAddress override (same deposit / withdraw / redeem selectors)
    allowErc20Approve([USDC], [symbiotic.kpkUsdcLiquidLane]),
    {
      ...allow.mainnet.morpho.vault.deposit(undefined, c.avatar),
      targetAddress: symbiotic.kpkUsdcLiquidLane,
    },
    {
      ...allow.mainnet.morpho.vault.withdraw(undefined, c.avatar, c.avatar),
      targetAddress: symbiotic.kpkUsdcLiquidLane,
    },
    {
      ...allow.mainnet.morpho.vault.redeem(undefined, c.avatar, c.avatar),
      targetAddress: symbiotic.kpkUsdcLiquidLane,
    },
  ] satisfies PermissionList
