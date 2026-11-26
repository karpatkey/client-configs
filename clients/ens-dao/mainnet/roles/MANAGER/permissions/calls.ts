import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import {
  ankrETH,
  AURA,
  BAL,
  COMP,
  CRV,
  CVX,
  DAI,
  eETH,
  ETHx,
  LDO,
  MORPHO,
  OETH,
  osETH,
  rETH,
  RLUSD,
  RPL,
  SPK,
  stETH,
  sUSDS,
  SWISE,
  USDC,
  USDS,
  USDT,
  weETH,
  WETH,
  wstETH,
  x3CRV,
  aura,
  balancerV2,
  balancerV3,
  curve,
  euler,
  fluid,
  pendle,
  rysk,
  stakeWiseV3,
} from "@/addresses/eth"
import { encodeBytes32String } from "defi-kit"
import { zeroAddress, eAddress } from "@/addresses"
import { contracts } from "@/contracts"
import {
  allowErc20Approve,
  allowErc20Transfer,
  allowEtherfiAssistedBalanceRecoveryMainnet,
  allowEthTransfer,
  allowStakeWiseV3AssistedBalanceRecoveryMainnet,
} from "@/helpers"
import { PermissionList } from "@/types"
import { balancerV2Swap } from "@/exit_strategies/balancerV2"
import { Parameters } from "../../../../parameters"
import { timeLock } from "../../../../addresses"

// Rysk options (PUR 11). Strikes and amounts use 8 decimals; prices are per
// option in the premium token, with 18 decimals.
const E8 = 10n ** 8n
const E18 = 10n ** 18n
// Deposit caps, enforced with refilling allowances (90-day period)
const RYSK_WETH_DEPOSIT_KEY = "RYSK_WETH_DEPOSIT"
const RYSK_USDC_DEPOSIT_KEY = "RYSK_USDC_DEPOSIT"
const RYSK_WETH_DEPOSIT_CAP = 1_000n * E18 // 1,000 WETH (18 decimals)
const RYSK_USDC_DEPOSIT_CAP = 2_000_000n * 10n ** 6n // 2,000,000 USDC (6 decimals)
// Strike bounds (catch decimal mistakes): calls above $100, puts above $100
// and below $10,000
const RYSK_CALL_STRIKE_FLOOR = 100n * E8
const RYSK_PUT_STRIKE_FLOOR = 100n * E8
const RYSK_PUT_STRIKE_CEILING = 10_000n * E8
// Minimum premium per option: 0.00001 WETH (calls) / 0.01 USDC (puts)
const RYSK_CALL_MIN_PRICE = E18 / 100_000n
const RYSK_PUT_MIN_PRICE = E18 / 100n
// Buyback ceilings: calls 1 WETH per option; puts by strike band (USD)
const RYSK_CALL_BUYBACK_MAX_PRICE = E18
const RYSK_PUT_BUYBACK_BANDS = [
  125n,
  250n,
  500n,
  1_000n,
  2_000n,
  4_000n,
  8_000n,
  16_000n,
]
// Sale expiries: Friday 08:00 UTC, 52 weeks from 11 Dec 2026 to 3 Dec 2027.
// Renew with a PUR before the list runs out (new sales are blocked after it).
const RYSK_FIRST_EXPIRY = 1796976000 // Fri 11 Dec 2026 08:00:00 UTC
const RYSK_EXPIRIES = Array.from(
  { length: 52 },
  (_, i) => RYSK_FIRST_EXPIRY + i * 7 * 24 * 60 * 60
)

export default (parameters: Parameters) =>
  [
    // Wrapping and unwrapping of ETH, WETH
    allow.mainnet.weth.withdraw(),
    allow.mainnet.weth.deposit({
      send: true,
    }),

    // Aave v3 Horizon Market - RLUSD
    allowErc20Approve([RLUSD], [contracts.mainnet.aaveV3.poolHorizonV3]),
    allow.mainnet.aaveV3.poolHorizonV3.supply(RLUSD, undefined, c.avatar),
    allow.mainnet.aaveV3.poolHorizonV3.withdraw(RLUSD, undefined, c.avatar),

    // Aura - Aave Lido Boosted WETH/wstETH
    allowErc20Approve(
      [balancerV3.aaveLidoWethWstEth],
      [contracts.mainnet.aura.booster]
    ),
    allow.mainnet.aura.booster.deposit("240"),
    {
      ...allow.mainnet.aura.rewarder.withdrawAndUnwrap(),
      targetAddress: aura.auraAaveLidoWethWstEthRewarder,
    },
    {
      ...allow.mainnet.aura.rewarder["getReward()"](),
      targetAddress: aura.auraAaveLidoWethWstEthRewarder,
    },
    {
      ...allow.mainnet.aura.rewarder["getReward(address,bool)"](c.avatar),
      targetAddress: aura.auraAaveLidoWethWstEthRewarder,
    },

    // Aura - Aave Boosted osETH/waWETH
    allowErc20Approve(
      [balancerV3.osEthWaWeth],
      [contracts.mainnet.aura.booster]
    ),
    allow.mainnet.aura.booster.deposit("260"),
    {
      ...allow.mainnet.aura.rewarder.withdrawAndUnwrap(),
      targetAddress: aura.auraOsETHWaWethRewarder,
    },
    {
      ...allow.mainnet.aura.rewarder["getReward()"](),
      targetAddress: aura.auraOsETHWaWethRewarder,
    },
    {
      ...allow.mainnet.aura.rewarder["getReward(address,bool)"](c.avatar),
      targetAddress: aura.auraOsETHWaWethRewarder,
    },

    // Balancer v3 - Aave Lido Boosted WETH/wstETH
    allowErc20Approve([WETH, wstETH], [contracts.mainnet.uniswap.permit2]),
    allow.mainnet.uniswap.permit2.approve(
      c.or(WETH, wstETH),
      contracts.mainnet.balancerV3.compositeLiquidityRouter
    ),
    allow.mainnet.balancerV3.compositeLiquidityRouter.addLiquidityProportionalToERC4626Pool(
      balancerV3.aaveLidoWethWstEth
    ),
    allow.mainnet.balancerV3.compositeLiquidityRouter.addLiquidityUnbalancedToERC4626Pool(
      balancerV3.aaveLidoWethWstEth
    ),
    allowErc20Approve(
      [balancerV3.aaveLidoWethWstEth],
      [contracts.mainnet.balancerV3.compositeLiquidityRouter]
    ),
    allow.mainnet.balancerV3.compositeLiquidityRouter.removeLiquidityProportionalFromERC4626Pool(
      balancerV3.aaveLidoWethWstEth
    ),
    allowErc20Approve(
      [balancerV3.aaveLidoWethWstEth],
      [balancerV3.aaveLidoWethWstEthGauge]
    ),
    {
      ...allow.mainnet.balancerV2.gauge["deposit(uint256)"](),
      targetAddress: balancerV3.aaveLidoWethWstEthGauge,
    },
    {
      ...allow.mainnet.balancerV2.gauge["withdraw(uint256)"](),
      targetAddress: balancerV3.aaveLidoWethWstEthGauge,
    },
    {
      ...allow.mainnet.balancerV2.gauge["claim_rewards()"](),
      targetAddress: balancerV3.aaveLidoWethWstEthGauge,
    },
    allow.mainnet.balancerV2.minter.mint(balancerV3.aaveLidoWethWstEthGauge),

    // Balancer v3 - Aave Boosted WETH/osETH
    allowErc20Approve([WETH, osETH], [contracts.mainnet.uniswap.permit2]),
    allow.mainnet.uniswap.permit2.approve(
      c.or(WETH, osETH),
      contracts.mainnet.balancerV3.compositeLiquidityRouter
    ),
    allow.mainnet.balancerV3.compositeLiquidityRouter.addLiquidityProportionalToERC4626Pool(
      balancerV3.osEthWaWeth
    ),
    allow.mainnet.balancerV3.compositeLiquidityRouter.addLiquidityUnbalancedToERC4626Pool(
      balancerV3.osEthWaWeth
    ),
    allowErc20Approve(
      [balancerV3.osEthWaWeth],
      [contracts.mainnet.balancerV3.compositeLiquidityRouter]
    ),
    allow.mainnet.balancerV3.compositeLiquidityRouter.removeLiquidityProportionalFromERC4626Pool(
      balancerV3.osEthWaWeth
    ),
    allowErc20Approve([balancerV3.osEthWaWeth], [balancerV3.osEthWaWethGauge]),
    {
      ...allow.mainnet.balancerV2.gauge["deposit(uint256)"](),
      targetAddress: balancerV3.osEthWaWethGauge,
    },
    {
      ...allow.mainnet.balancerV2.gauge["withdraw(uint256)"](),
      targetAddress: balancerV3.osEthWaWethGauge,
    },
    {
      ...allow.mainnet.balancerV2.gauge["claim_rewards()"](),
      targetAddress: balancerV3.osEthWaWethGauge,
    },
    allow.mainnet.balancerV2.minter.mint(balancerV3.osEthWaWethGauge),

    // Balancer v3 - Aave Boosted WETH/ETHx
    allowErc20Approve([WETH, ETHx], [contracts.mainnet.uniswap.permit2]),
    allow.mainnet.uniswap.permit2.approve(
      c.or(WETH, ETHx),
      contracts.mainnet.balancerV3.compositeLiquidityRouter
    ),
    allow.mainnet.balancerV3.compositeLiquidityRouter.addLiquidityProportionalToERC4626Pool(
      balancerV3.ethxWaWeth
    ),
    allow.mainnet.balancerV3.compositeLiquidityRouter.addLiquidityUnbalancedToERC4626Pool(
      balancerV3.ethxWaWeth
    ),
    allowErc20Approve(
      [balancerV3.ethxWaWeth],
      [contracts.mainnet.balancerV3.compositeLiquidityRouter]
    ),
    allow.mainnet.balancerV3.compositeLiquidityRouter.removeLiquidityProportionalFromERC4626Pool(
      balancerV3.ethxWaWeth
    ),
    allowErc20Approve([balancerV3.ethxWaWeth], [balancerV3.ethxWaWethGauge]),
    {
      ...allow.mainnet.balancerV2.gauge["deposit(uint256)"](),
      targetAddress: balancerV3.ethxWaWethGauge,
    },
    {
      ...allow.mainnet.balancerV2.gauge["withdraw(uint256)"](),
      targetAddress: balancerV3.ethxWaWethGauge,
    },
    {
      ...allow.mainnet.balancerV2.gauge["claim_rewards()"](),
      targetAddress: balancerV3.ethxWaWethGauge,
    },
    allow.mainnet.balancerV2.minter.mint(balancerV3.ethxWaWethGauge),

    // Compound v3 - Deposit ETH
    allow.mainnet.compoundV3.cWethV3.allow(
      contracts.mainnet.compoundV3.mainnetBulker
    ),
    allow.mainnet.compoundV3.mainnetBulker.invoke(
      c.every(
        c.or(
          c.eq(
            "0x414354494f4e5f535550504c595f4e41544956455f544f4b454e000000000000" // ACTION_SUPPLY_NATIVE_TOKEN
          ),
          c.eq(
            "0x414354494f4e5f57495448445241575f4e41544956455f544f4b454e00000000" // ACTION_WITHDRAW_NATIVE_TOKEN
          )
        )
      ),
      c.every(
        c.abiEncodedMatches(
          [contracts.mainnet.compoundV3.cWethV3, c.avatar],
          ["address", "address", "uint256"]
        )
      ),
      { send: true }
    ),

    // Curve - ETH/stETH - steCRV
    allowErc20Approve([stETH], [contracts.mainnet.curve.steCrvPool]),
    allow.mainnet.curve.steCrvPool.add_liquidity(undefined, undefined, {
      send: true,
    }),
    allow.mainnet.curve.steCrvPool.remove_liquidity(),
    allow.mainnet.curve.steCrvPool.remove_liquidity_one_coin(),
    allow.mainnet.curve.steCrvPool.remove_liquidity_imbalance(),
    allowErc20Approve(
      [curve.steCrv],
      [contracts.mainnet.curve.steCrvPoolGauge]
    ),
    allow.mainnet.curve.steCrvPoolGauge["deposit(uint256)"](),
    allow.mainnet.curve.steCrvPoolGauge.withdraw(),
    allow.mainnet.curve.steCrvPoolGauge["claim_rewards()"](),
    allow.mainnet.curve.crvMinter.mint(contracts.mainnet.curve.steCrvPoolGauge),
    // Deposit and Stake using a special ZAP
    allow.mainnet.curve.steCrvPoolGauge.set_approve_deposit(
      contracts.mainnet.curve.stakeDepositZap
    ),

    // Curve - ETH/stETH - stETH-ng-f
    allowErc20Approve([stETH], [contracts.mainnet.curve.stEthNgfPool]),
    allow.mainnet.curve.stEthNgfPool["add_liquidity(uint256[2],uint256)"](
      undefined,
      undefined,
      { send: true }
    ),
    allow.mainnet.curve.stEthNgfPool["remove_liquidity(uint256,uint256[2])"](),
    allow.mainnet.curve.stEthNgfPool[
      "remove_liquidity_one_coin(uint256,int128,uint256)"
    ](),
    allow.mainnet.curve.stEthNgfPool[
      "remove_liquidity_imbalance(uint256[2],uint256)"
    ](),
    allowErc20Approve(
      [contracts.mainnet.curve.stEthNgfPool],
      [contracts.mainnet.curve.stEthNgfGauge]
    ),
    allow.mainnet.curve.stEthNgfGauge["deposit(uint256)"](),
    allow.mainnet.curve.stEthNgfGauge["withdraw(uint256)"](),
    allow.mainnet.curve.stEthNgfGauge["claim_rewards()"](),
    allow.mainnet.curve.crvMinter.mint(contracts.mainnet.curve.stEthNgfGauge),

    // Curve - ETH/OETH
    allowErc20Approve([OETH], [contracts.mainnet.curve.oEthCrvPool]),
    allow.mainnet.curve.oEthCrvPool["add_liquidity(uint256[2],uint256)"](
      undefined,
      undefined,
      {
        send: true,
      }
    ),
    allow.mainnet.curve.oEthCrvPool["remove_liquidity(uint256,uint256[2])"](),
    allow.mainnet.curve.oEthCrvPool[
      "remove_liquidity_imbalance(uint256[2],uint256)"
    ](),
    allow.mainnet.curve.oEthCrvPool[
      "remove_liquidity_one_coin(uint256,int128,uint256)"
    ](),
    allowErc20Approve(
      [contracts.mainnet.curve.oEthCrvPool],
      [contracts.mainnet.curve.oEthCrvGauge]
    ),
    allow.mainnet.curve.oEthCrvGauge["deposit(uint256)"](),
    allow.mainnet.curve.oEthCrvGauge["withdraw(uint256)"](),
    allow.mainnet.curve.oEthCrvGauge["claim_rewards()"](),
    allow.mainnet.curve.crvMinter.mint(contracts.mainnet.curve.oEthCrvGauge),

    // Curve - x3CRV - DAI/USDC/USDT
    allowErc20Approve([DAI, USDC, USDT], [contracts.mainnet.curve.x3CrvPool]),
    allow.mainnet.curve.x3CrvPool.add_liquidity(),
    allow.mainnet.curve.x3CrvPool.remove_liquidity(),
    allow.mainnet.curve.x3CrvPool.remove_liquidity_imbalance(),
    allow.mainnet.curve.x3CrvPool.remove_liquidity_one_coin(),
    allowErc20Approve([x3CRV], [contracts.mainnet.curve.x3CrvGauge]),
    allow.mainnet.curve.x3CrvGauge["deposit(uint256)"](),
    allow.mainnet.curve.x3CrvGauge.withdraw(),
    allow.mainnet.curve.crvMinter.mint(contracts.mainnet.curve.x3CrvGauge),
    // Deposit and Stake using a special ZAP
    allow.mainnet.curve.x3CrvGauge.set_approve_deposit(
      contracts.mainnet.curve.stakeDepositZap
    ),

    // Curve - ETHx/ETH - ethx-f
    allowErc20Approve([ETHx], [contracts.mainnet.curve.ethxfPool]),
    allow.mainnet.curve.ethxfPool["add_liquidity(uint256[2],uint256)"](
      undefined,
      undefined,
      {
        send: true,
      }
    ),
    allow.mainnet.curve.ethxfPool["remove_liquidity(uint256,uint256[2])"](),
    allow.mainnet.curve.ethxfPool[
      "remove_liquidity_imbalance(uint256[2],uint256)"
    ](),
    allow.mainnet.curve.ethxfPool[
      "remove_liquidity_one_coin(uint256,int128,uint256)"
    ](),
    allowErc20Approve(
      [contracts.mainnet.curve.ethxfPool],
      [contracts.mainnet.curve.ethxfGauge]
    ),
    allow.mainnet.curve.ethxfGauge["deposit(uint256)"](),
    allow.mainnet.curve.ethxfGauge["withdraw(uint256)"](),
    allow.mainnet.curve.ethxfGauge["claim_rewards()"](),
    allow.mainnet.curve.crvMinter.mint(contracts.mainnet.curve.ethxfGauge),

    // Curve - osETH/rETH
    allowErc20Approve([osETH, rETH], [contracts.mainnet.curve.osEthRethPool]),
    allow.mainnet.curve.osEthRethPool["add_liquidity(uint256[],uint256)"](),
    allow.mainnet.curve.osEthRethPool["remove_liquidity(uint256,uint256[])"](),
    allow.mainnet.curve.osEthRethPool[
      "remove_liquidity_one_coin(uint256,int128,uint256)"
    ](),
    allow.mainnet.curve.osEthRethPool[
      "remove_liquidity_imbalance(uint256[],uint256)"
    ](),
    allowErc20Approve(
      [contracts.mainnet.curve.osEthRethPool],
      [contracts.mainnet.curve.osEthRethGauge]
    ),
    allow.mainnet.curve.osEthRethGauge["deposit(uint256)"](),
    allow.mainnet.curve.osEthRethGauge["withdraw(uint256)"](),
    allow.mainnet.curve.osEthRethGauge["withdraw(uint256,bool)"](),
    allow.mainnet.curve.osEthRethGauge["claim_rewards()"](),
    allow.mainnet.curve.crvMinter.mint(contracts.mainnet.curve.osEthRethGauge),

    // Curve - OETH/WETH
    allowErc20Approve([OETH, WETH], [contracts.mainnet.curve.oEthWethPool]),
    allow.mainnet.curve.oEthWethPool["add_liquidity(uint256[],uint256)"](),
    allow.mainnet.curve.oEthWethPool["remove_liquidity(uint256,uint256[])"](),
    allow.mainnet.curve.oEthWethPool[
      "remove_liquidity_imbalance(uint256[],uint256)"
    ](),
    allow.mainnet.curve.oEthWethPool[
      "remove_liquidity_one_coin(uint256,int128,uint256)"
    ](),
    allowErc20Approve(
      [contracts.mainnet.curve.oEthWethPool],
      [contracts.mainnet.curve.oEthWethGauge]
    ),
    allow.mainnet.curve.oEthWethGauge["deposit(uint256)"](),
    allow.mainnet.curve.oEthWethGauge["withdraw(uint256)"](),
    allow.mainnet.curve.oEthWethGauge["claim_rewards()"](),
    allow.mainnet.curve.crvMinter.mint(contracts.mainnet.curve.oEthWethGauge),

    // Curve - Deposit and Stake using a special ZAP
    allowErc20Approve(
      [DAI, ETHx, OETH, osETH, rETH, stETH, USDC, USDT, WETH],
      [contracts.mainnet.curve.stakeDepositZap]
    ),
    allow.mainnet.curve.stakeDepositZap[
      "deposit_and_stake(address,address,address,uint256,address[],uint256[],uint256,bool,bool,address)"
    ](
      c.or(
        contracts.mainnet.curve.steCrvPool,
        contracts.mainnet.curve.stEthNgfPool,
        contracts.mainnet.curve.oEthCrvPool,
        contracts.mainnet.curve.x3CrvPool,
        contracts.mainnet.curve.ethxfPool,
        contracts.mainnet.curve.osEthRethPool,
        contracts.mainnet.curve.oEthWethPool
      ),
      c.or(
        curve.steCrv,
        contracts.mainnet.curve.stEthNgfPool,
        contracts.mainnet.curve.oEthCrvPool,
        x3CRV,
        contracts.mainnet.curve.ethxfPool,
        contracts.mainnet.curve.osEthRethPool,
        contracts.mainnet.curve.oEthWethPool
      ),
      c.or(
        contracts.mainnet.curve.steCrvPoolGauge,
        contracts.mainnet.curve.stEthNgfGauge,
        contracts.mainnet.curve.oEthCrvGauge,
        contracts.mainnet.curve.x3CrvGauge,
        contracts.mainnet.curve.ethxfGauge,
        contracts.mainnet.curve.osEthRethGauge,
        contracts.mainnet.curve.oEthWethGauge
      ),
      c.or(2, 3),
      c.or(
        [eAddress, stETH],
        [eAddress, OETH],
        [DAI, USDC, USDT],
        [eAddress, ETHx],
        [osETH, rETH],
        [OETH, WETH]
      ),
      undefined,
      undefined,
      undefined,
      undefined,
      zeroAddress,
      { send: true }
    ),

    // ether.fi - Earn - Stake
    // Stake ETH for weETH
    allow.mainnet.etherfi.depositAdapter.depositETHForWeETH(undefined, {
      send: true,
    }),
    // Stake WETH for weETH
    allowErc20Approve([WETH], [contracts.mainnet.etherfi.depositAdapter]),
    allow.mainnet.etherfi.depositAdapter.depositWETHForWeETH(
      undefined,
      c.avatar
    ),
    // Stake stETH for weETH
    allowErc20Approve([stETH], [contracts.mainnet.etherfi.depositAdapter]),
    allow.mainnet.etherfi.depositAdapter.depositStETHForWeETHWithPermit(
      undefined,
      c.avatar
    ),
    // Stake wstETH for weETH
    allowErc20Approve([wstETH], [contracts.mainnet.etherfi.depositAdapter]),
    allow.mainnet.etherfi.depositAdapter.depositWstETHForWeETHWithPermit(
      undefined,
      c.avatar
    ),
    // Standard unstaking eETH -> ETH - A Withdraw Request NFT is issued
    allowErc20Approve([eETH], [contracts.mainnet.etherfi.liquidityPool]),
    allow.mainnet.etherfi.liquidityPool.requestWithdraw(c.avatar),
    // Standard unstaking weETH -> ETH - A Withdraw Request NFT is issued
    allowErc20Approve([weETH], [contracts.mainnet.etherfi.withdrawalAdapter]),
    allow.mainnet.etherfi.withdrawalAdapter.requestWithdraw(
      undefined,
      c.avatar
    ),
    // Funds can be claimed once the request is finalized
    // The same function is called for both paths (eETH/weETH -> ETH)
    allow.mainnet.etherfi.withdrawRequestNft.claimWithdraw(),
    // Express unstaking eETH -> ETH
    allowErc20Approve([eETH], [contracts.mainnet.etherfi.redemptionManager]),
    allow.mainnet.etherfi.redemptionManager.redeemEEth(
      undefined,
      c.avatar,
      eAddress
    ),
    allow.mainnet.etherfi.redemptionManager.redeemEEthWithPermit(
      undefined,
      c.avatar,
      undefined,
      eAddress
    ),
    // Express unstaking weETH -> ETH
    allowErc20Approve([weETH], [contracts.mainnet.etherfi.redemptionManager]),
    allow.mainnet.etherfi.redemptionManager.redeemWeEth(
      undefined,
      c.avatar,
      eAddress
    ),
    allow.mainnet.etherfi.redemptionManager.redeemWeEthWithPermit(
      undefined,
      c.avatar,
      undefined,
      eAddress
    ),
    // ether.fi - Wrap/Unwrap
    // Wrap eETH
    allowErc20Approve([eETH], [contracts.mainnet.etherfi.weEth]),
    allow.mainnet.etherfi.weEth.wrap(),
    // Unwrap weETH
    allow.mainnet.etherfi.weEth.unwrap(),
    // ether.fi - Claim rewards
    allow.mainnet.etherfi.kingDistributor.claim(c.avatar),
    // ether.fi - Withdrawal queue adapter (ADR 0030): Safe-side recovery
    // (evict / submit / remove of its own onchain-accounting entries)
    ...allowEtherfiAssistedBalanceRecoveryMainnet(),

    // Euler - KPK RWA USDC
    allowErc20Approve([USDC], [euler.kpkRwaUsdc]),
    {
      ...allow.mainnet.euler.eVault.deposit(undefined, c.avatar),
      targetAddress: euler.kpkRwaUsdc,
    },
    {
      ...allow.mainnet.euler.eVault.withdraw(undefined, c.avatar, c.avatar),
      targetAddress: euler.kpkRwaUsdc,
    },
    {
      ...allow.mainnet.euler.eVault.redeem(undefined, c.avatar, c.avatar),
      targetAddress: euler.kpkRwaUsdc,
    },

    // Fluid - FLUID Rewards
    {
      ...allow.mainnet.fluid.merkleDistributor.claim(c.avatar),
      targetAddress: fluid.fluidRewardsDec2024,
    },

    // Fluid - GHO Rewards
    {
      ...allow.mainnet.fluid.merkleDistributor.claim(c.avatar),
      targetAddress: fluid.ghoRewards,
    },

    // Merkl - Rewards
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
        ],
        [
          parameters.avatar,
          parameters.avatar,
          parameters.avatar,
          parameters.avatar,
          parameters.avatar,
        ]
      )
    ),

    // Origin - Mint OETH
    allow.mainnet.origin.oEthZapper.deposit({ send: true }),
    // Opt into yield
    allow.mainnet.origin.oEth.rebaseOptIn(),
    // Origin - Redeem via ARM (Automated Redemption Manager)
    allowErc20Approve([OETH], [contracts.mainnet.origin.armOethWeth]),
    allow.mainnet.origin.armOethWeth[
      "swapExactTokensForTokens(address,address,uint256,uint256,address)"
    ](OETH, WETH, undefined, undefined, c.avatar),
    // Origin - Redeem via OETH Vault
    // OETH is burnt by the user so no approval is needed
    allow.mainnet.origin.oEthVault.requestWithdrawal(),
    allow.mainnet.origin.oEthVault.claimWithdrawal(),
    allow.mainnet.origin.oEthVault.claimWithdrawals(),

    // Pendle - PT-sUSDS-26NOV2026: buy / sell / redeem at maturity (RouterV4)
    // Aggregator-free routes only (pendleSwap = zeroAddress, swapType NONE) and
    // no limit-order fills; recipient pinned to the avatar Safe.
    allowErc20Approve(
      [sUSDS, USDS, pendle.ptSusds26Nov2026],
      [contracts.mainnet.pendle.routerV4]
    ),
    allow.mainnet.pendle.routerV4.swapExactTokenForPt(
      c.avatar,
      pendle.marketSusds26Nov2026,
      undefined,
      undefined,
      {
        tokenIn: c.or(sUSDS, USDS),
        tokenMintSy: c.or(sUSDS, USDS),
        pendleSwap: zeroAddress,
        swapData: {
          swapType: 0,
          extRouter: zeroAddress,
          extCalldata: "0x",
        },
      },
      {
        limitRouter: zeroAddress,
        normalFills: [],
        flashFills: [],
      }
    ),
    allow.mainnet.pendle.routerV4.swapExactPtForToken(
      c.avatar,
      pendle.marketSusds26Nov2026,
      undefined,
      {
        tokenOut: c.or(sUSDS, USDS),
        tokenRedeemSy: c.or(sUSDS, USDS),
        pendleSwap: zeroAddress,
        swapData: {
          swapType: 0,
          extRouter: zeroAddress,
          extCalldata: "0x",
        },
      },
      {
        limitRouter: zeroAddress,
        normalFills: [],
        flashFills: [],
      }
    ),
    allow.mainnet.pendle.routerV4.redeemPyToToken(
      c.avatar,
      pendle.ytSusds26Nov2026,
      undefined,
      {
        tokenOut: c.or(sUSDS, USDS),
        tokenRedeemSy: c.or(sUSDS, USDS),
        pendleSwap: zeroAddress,
        swapData: {
          swapType: 0,
          extRouter: zeroAddress,
          extCalldata: "0x",
        },
      }
    ),

    // Rysk - KPK physically settled options vaults: kpkUSDCWETH (cash-secured
    // puts, USDC collateral) and kpkWETHUSDC (covered calls, WETH collateral).
    // Vault functions take no recipient and act on msg.sender.
    // depositSecondary is not granted (both vaults are PrimaryOnly).
    // Approvals capped at the deposit caps (no unlimited approval)
    {
      targetAddress: USDC,
      signature: "approve(address,uint256)",
      condition: c.calldataMatches(
        [rysk.kpkUsdcWeth, c.lte(RYSK_USDC_DEPOSIT_CAP)],
        ["address", "uint256"]
      ),
    },
    {
      targetAddress: WETH,
      signature: "approve(address,uint256)",
      condition: c.calldataMatches(
        [rysk.kpkWethUsdc, c.lte(RYSK_WETH_DEPOSIT_CAP)],
        ["address", "uint256"]
      ),
    },
    // Deposits within a refilling allowance: 2,000,000 USDC / 1,000 WETH per
    // 90 days (set with setAllowance in the payload)
    {
      ...allow.mainnet.rysk.physicalLiquidityPool.depositPrimary(
        c.withinAllowance(
          encodeBytes32String(RYSK_USDC_DEPOSIT_KEY) as `0x${string}`
        )
      ),
      targetAddress: rysk.kpkUsdcWeth,
    },
    {
      ...allow.mainnet.rysk.physicalLiquidityPool.depositPrimary(
        c.withinAllowance(
          encodeBytes32String(RYSK_WETH_DEPOSIT_KEY) as `0x${string}`
        )
      ),
      targetAddress: rysk.kpkWethUsdc,
    },
    // Redeem shares, withdraw, and collect the curator fees (manager seat)
    ...[rysk.kpkUsdcWeth, rysk.kpkWethUsdc].flatMap((vault) => [
      {
        ...allow.mainnet.rysk.physicalLiquidityPool.redeem(),
        targetAddress: vault,
      },
      {
        ...allow.mainnet.rysk.physicalLiquidityPool.initiateWithdraw(),
        targetAddress: vault,
      },
      {
        ...allow.mainnet.rysk.physicalLiquidityPool.completeWithdraw(),
        targetAddress: vault,
      },
      {
        ...allow.mainnet.rysk.physicalLiquidityPool.withdrawCuratorFees(),
        targetAddress: vault,
      },
    ]),
    // Accept the manager (curator) seat on each vault's Authority
    {
      ...allow.mainnet.rysk.authority.pullManager(),
      targetAddress: rysk.kpkUsdcWethAuthority,
    },
    {
      ...allow.mainnet.rysk.authority.pullManager(),
      targetAddress: rysk.kpkWethUsdcAuthority,
    },
    // Option orders (OTC, the market maker executes them): createOrder and
    // deleteOrder (cancel before execution). executeRFQOrder not granted.
    // Puts (kpkUSDCWETH handler): WETH/USDC series with USDC collateral,
    // premium in USDC only. Sale: strike above $100 and below $10,000,
    // price >= 0.01 USDC per option, expiry on the Friday 08:00 UTC list
    {
      ...allow.mainnet.rysk.physicalOptionHandler.createOrder(
        {
          expiration: c.or(...(RYSK_EXPIRIES as [number, number, ...number[]])),
          strike: c.and(
            c.gt(RYSK_PUT_STRIKE_FLOOR),
            c.lt(RYSK_PUT_STRIKE_CEILING)
          ),
          isPut: true,
          underlying: WETH,
          strikeAsset: USDC,
          collateral: USDC,
        },
        undefined,
        c.gte(RYSK_PUT_MIN_PRICE),
        undefined,
        undefined,
        false,
        USDC
      ),
      targetAddress: rysk.kpkUsdcWethOptionHandler,
    },
    // Put buyback by strike band: strike in (previous band, band] -> price <=
    // band in USDC per option, i.e. between 1x and 2x the strike (puts are
    // only sold above a $100 strike)
    ...RYSK_PUT_BUYBACK_BANDS.map((band, i) => ({
      ...allow.mainnet.rysk.physicalOptionHandler.createOrder(
        {
          strike:
            i === 0
              ? c.lte(band * E8)
              : c.and(
                  c.gt(RYSK_PUT_BUYBACK_BANDS[i - 1]! * E8),
                  c.lte(band * E8)
                ),
          isPut: true,
          underlying: WETH,
          strikeAsset: USDC,
          collateral: USDC,
        },
        undefined,
        c.lte(band * E18),
        undefined,
        undefined,
        true,
        USDC
      ),
      targetAddress: rysk.kpkUsdcWethOptionHandler,
    })),
    // Calls (kpkWETHUSDC handler): WETH/USDC series with WETH collateral,
    // premium in WETH only. Sale: strike above $100, price >= 0.00001 WETH per
    // option, expiry on the Friday 08:00 UTC list
    {
      ...allow.mainnet.rysk.physicalOptionHandler.createOrder(
        {
          expiration: c.or(...(RYSK_EXPIRIES as [number, number, ...number[]])),
          strike: c.gt(RYSK_CALL_STRIKE_FLOOR),
          isPut: false,
          underlying: WETH,
          strikeAsset: USDC,
          collateral: WETH,
        },
        undefined,
        c.gte(RYSK_CALL_MIN_PRICE),
        undefined,
        undefined,
        false,
        WETH
      ),
      targetAddress: rysk.kpkWethUsdcOptionHandler,
    },
    // Call buyback: price <= 1 WETH per option
    {
      ...allow.mainnet.rysk.physicalOptionHandler.createOrder(
        {
          isPut: false,
          underlying: WETH,
          strikeAsset: USDC,
          collateral: WETH,
        },
        undefined,
        c.lte(RYSK_CALL_BUYBACK_MAX_PRICE),
        undefined,
        undefined,
        true,
        WETH
      ),
      targetAddress: rysk.kpkWethUsdcOptionHandler,
    },
    // Cancel an order before the market maker executes it (both handlers)
    {
      ...allow.mainnet.rysk.physicalOptionHandler.deleteOrder(),
      targetAddress: rysk.kpkUsdcWethOptionHandler,
    },
    {
      ...allow.mainnet.rysk.physicalOptionHandler.deleteOrder(),
      targetAddress: rysk.kpkWethUsdcOptionHandler,
    },

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

    // StakeWise v3 - Genesis Vault
    {
      ...allow.mainnet.stakeWiseV3.vault.deposit(c.avatar, undefined, {
        send: true,
      }),
      targetAddress: stakeWiseV3.genesis,
    },
    {
      ...allow.mainnet.stakeWiseV3.vault.updateState(),
      targetAddress: stakeWiseV3.genesis,
    },
    {
      ...allow.mainnet.stakeWiseV3.vault.updateStateAndDeposit(
        c.avatar,
        undefined,
        undefined,
        {
          send: true,
        }
      ),
      targetAddress: stakeWiseV3.genesis,
    },
    {
      ...allow.mainnet.stakeWiseV3.vault.mintOsToken(c.avatar),
      targetAddress: stakeWiseV3.genesis,
    },
    {
      ...allow.mainnet.stakeWiseV3.vault.burnOsToken(),
      targetAddress: stakeWiseV3.genesis,
    },
    {
      ...allow.mainnet.stakeWiseV3.vault.enterExitQueue(undefined, c.avatar),
      targetAddress: stakeWiseV3.genesis,
    },
    {
      ...allow.mainnet.stakeWiseV3.vault.claimExitedAssets(),
      targetAddress: stakeWiseV3.genesis,
    },
    // StakeWise v3 - Exit queue adapter (ADR 0030): Safe-side recovery
    // (evict / submit / remove of its own onchain-accounting entries)
    ...allowStakeWiseV3AssistedBalanceRecoveryMainnet(),

    /*********************************************
     * SWAPS
     *********************************************/
    // Balancer - AURA -> WETH
    balancerV2Swap(balancerV2.b50Weth50AuraPid, [AURA], [WETH]),
    // Balancer - BAL -> WETH
    balancerV2Swap(balancerV2.b80Bal20WethPid, [BAL], [WETH]),
    // Balancer - WETH -> DAI
    balancerV2Swap(balancerV2.b60Weth40DaiPid, [WETH], [DAI]),
    // Balancer - WETH -> USDC
    balancerV2Swap(balancerV2.b50Usdc50WethPid, [WETH], [USDC]),
    // Balancer - COMP -> WETH
    balancerV2Swap(balancerV2.b50Comp50WethPid, [COMP], [WETH]),
    // Balancer - WETH <-> wstETH
    balancerV2Swap(balancerV2.bStEthStablePid, [WETH, wstETH], [WETH, wstETH]),
    // Balancer - WETH <-> wstETH
    balancerV2Swap(
      balancerV2.eclpWstEthWethPid,
      [WETH, wstETH],
      [WETH, wstETH]
    ),
    // Balancer - rETH <-> WETH
    balancerV2Swap(balancerV2.bREthStablePid, [rETH, WETH], [rETH, WETH]),
    // Balancer - ankrETH <-> wstETH
    balancerV2Swap(
      balancerV2.ankrEthWstEthPid,
      [ankrETH, wstETH],
      [ankrETH, wstETH]
    ),
    // Balancer - ETHx <-> WETH
    balancerV2Swap(balancerV2.ethxWethPid, [ETHx, WETH], [ETHx, WETH]),
    // Balancer - osETH <-> WETH
    balancerV2Swap(balancerV2.osEthWethPid, [osETH, WETH], [osETH, WETH]),
    // Balancer - OETH <-> WETH
    balancerV2Swap(balancerV2.oEthWethPid, [OETH, WETH], [OETH, WETH]),
    // Balancer - USDC <-> USDT
    balancerV2Swap(balancerV2.usdcUsdtPid, [USDC, USDT], [USDC, USDT]),

    // Curve - ETH <-> stETH
    allowErc20Approve([stETH], [contracts.mainnet.curve.steCrvPool]),
    allow.mainnet.curve.steCrvPool.exchange(
      undefined,
      undefined,
      undefined,
      undefined,
      {
        send: true,
      }
    ),

    // Curve - [DAI, USDC, USDT] <-> [DAI, USDC, USDT]
    allowErc20Approve([DAI, USDC, USDT], [contracts.mainnet.curve.x3CrvPool]),
    allow.mainnet.curve.x3CrvPool.exchange(),

    // Curve - CVX -> ETH
    allowErc20Approve([CVX], [contracts.mainnet.curve.cvxEthPool]),
    allow.mainnet.curve.cvxEthPool["exchange(uint256,uint256,uint256,uint256)"](
      1,
      0
    ),

    // Curve - ankrETH <-> ETH
    allowErc20Approve([ankrETH], [contracts.mainnet.curve.ankrEthPool]),
    allow.mainnet.curve.ankrEthPool.exchange(
      undefined,
      undefined,
      undefined,
      undefined,
      {
        send: true,
      }
    ),

    // Curve - ETH <-> OETH
    allowErc20Approve([OETH], [contracts.mainnet.curve.oEthCrvPool]),
    allow.mainnet.curve.oEthCrvPool["exchange(int128,int128,uint256,uint256)"](
      undefined,
      undefined,
      undefined,
      undefined,
      {
        send: true,
      }
    ),

    // PancakeSwap V3 - ETHx <-> WETH
    allowErc20Approve(
      [ETHx, WETH],
      [contracts.mainnet.pancakeSwapV3.smartRouter]
    ),
    allow.mainnet.pancakeSwapV3.smartRouter.exactInputSingle({
      tokenIn: c.or(ETHx, WETH),
      tokenOut: c.or(ETHx, WETH),
      recipient: c.avatar,
    }),

    // Uniswap v3
    // [ankrETH, AURA, BAL, COMP, CRV, CVX, DAI, ETHx, LDO, MORPHO, OETH, osETH, rETH, RPL, SPK, stETH, sUSDS, SWISE, USDC, USDS, USDT, WETH, wstETH] ->
    // [ankrETH, DAI, ETHx, OETH, osETH, rETH, stETH, sUSDS, USDC, USDS, USDT, WETH, wstETH]
    allowErc20Approve(
      [
        ankrETH,
        AURA,
        BAL,
        COMP,
        CRV,
        CVX,
        DAI,
        ETHx,
        LDO,
        MORPHO,
        OETH,
        osETH,
        rETH,
        RPL,
        SPK,
        stETH,
        sUSDS,
        SWISE,
        USDC,
        USDS,
        USDT,
        WETH,
        wstETH,
      ],
      [contracts.mainnet.uniswapV3.router2]
    ),
    allow.mainnet.uniswapV3.router2.exactInputSingle({
      tokenIn: c.or(
        ankrETH,
        AURA,
        BAL,
        COMP,
        CRV,
        CVX,
        DAI,
        ETHx,
        LDO,
        MORPHO,
        OETH,
        osETH,
        rETH,
        RPL,
        SPK,
        stETH,
        sUSDS,
        SWISE,
        USDC,
        USDS,
        USDT,
        WETH,
        wstETH
      ),
      tokenOut: c.or(
        ankrETH,
        DAI,
        ETHx,
        OETH,
        osETH,
        rETH,
        stETH,
        sUSDS,
        USDC,
        USDS,
        USDT,
        WETH,
        wstETH
      ),
      recipient: c.avatar,
    }),

    // Uniswap v3 - [USDT <-> WETH], Fee: [0.01, 0.05, 0.3]
    allowErc20Approve([USDT, WETH], [contracts.mainnet.uniswapV3.router2]),
    allow.mainnet.uniswapV3.router2.exactInputSingle({
      tokenIn: c.or(USDT, WETH),
      tokenOut: c.or(USDT, WETH),
      recipient: c.avatar,
      fee: c.or(100, 500, 3000),
    }),

    // Uniswap v3 - [USDC <-> WETH], Fee: [0.05, 0.3]
    allowErc20Approve([USDC, WETH], [contracts.mainnet.uniswapV3.router2]),
    allow.mainnet.uniswapV3.router2.exactInputSingle({
      tokenIn: c.or(USDC, WETH),
      tokenOut: c.or(USDC, WETH),
      recipient: c.avatar,
      fee: c.or(500, 3000),
    }),

    // Uniswap v3 - [USDC <-> USDT], Fee: [0.01]
    allowErc20Approve([USDC, USDT], [contracts.mainnet.uniswapV3.router2]),
    allow.mainnet.uniswapV3.router2.exactInputSingle({
      tokenIn: c.or(USDC, USDT),
      tokenOut: c.or(USDT, USDC),
      recipient: c.avatar,
      fee: 100,
    }),

    /*********************************************
     * Transfers
     *********************************************/
    // Transfer ETH to ENS Timelock
    allowEthTransfer(timeLock),

    // Transfer USDC to ENS Timelock
    allowErc20Transfer([USDC], [timeLock]),
  ] satisfies PermissionList
