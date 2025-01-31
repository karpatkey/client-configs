import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import { allow as allowAction } from "defi-kit/eth"
import {
  CRV,
  COMP,
  CVX,
  DAI,
  GHO,
  NOTE,
  USDC,
  USDT,
  SAFE,
  stETH,
  WBTC,
  WETH,
  wstETH,
  zeroAddress,
  eAddress,
} from "@/addresses/eth"
import { contracts } from "@/contracts"
import { allowErc20Approve } from "@/helpers"
import { PermissionList } from "../../../../../types"

export default [
  /*********************************************
   * DeFi-Kit permissions
   *********************************************/
  // Aave Safety Module - Stake AAVE and GHO
  allowAction.aave_v3.stake({ targets: ["AAVE", "GHO"] }),

  // Aura - wstETH/WETH
  allowAction.aura.deposit({ targets: ["153"] }),
  // Aura - Lock
  allowAction.aura.lock(),
  // Aura - Stake
  allowAction.aura.stake({ targets: ["B-80BAL-20WETH", "BAL", "auraBAL"] }),

  // Convex - USDT/WBTC/WETH
  allowAction.convex.deposit({ targets: ["188"] }),
  // Convex - GHO/WBTC/wstETH
  allowAction.convex.deposit({ targets: ["297"] }),

  // CowSwap - [DAI, USDC, USDT] -> [DAI, USDC, USDT, WETH]
  allowAction.cowswap.swap({
    sell: [DAI, USDC, USDT],
    buy: [DAI, USDC, USDT, WETH],
  }),
  // CowSwap - [CRV, COMP, CVX, NOTE] -> [DAI, USDC]
  allowAction.cowswap.swap({ sell: [CRV, COMP, CVX, NOTE], buy: [DAI, USDC] }),

  // Lido
  allowAction.lido.deposit(),

  // Rocket Pool
  allowAction.rocket_pool.deposit(),

  // Spark - DSR_sDAI
  allowAction.spark.deposit({ targets: ["DSR_sDAI"] }),

  /*********************************************
   * Typed-presets permissions
   *********************************************/
  // Wrapping and unwrapping of ETH, WETH
  allow.mainnet.weth.withdraw(),
  allow.mainnet.weth.deposit({
    send: true,
  }),

  // Compound v3 - Deposit USDC
  ...allowErc20Approve([USDC], [contracts.mainnet.compoundV3.cUsdcV3]),
  allow.mainnet.compoundV3.cUsdcV3.supply(USDC),
  allow.mainnet.compoundV3.cUsdcV3.withdraw(USDC),

  // Compound v3 - Claim rewards
  allow.mainnet.compoundV3.cometRewards.claim(undefined, c.avatar),

  // Curve - USDT/WBTC/WETH
  ...allowErc20Approve(
    [USDT, WBTC, WETH],
    [contracts.mainnet.curve.crvUsdtWbtcWethPool]
  ),
  allow.mainnet.curve.crvUsdtWbtcWethPool[
    "add_liquidity(uint256[3],uint256,bool)"
  ](undefined, undefined, undefined, {
    send: true,
  }),
  allow.mainnet.curve.crvUsdtWbtcWethPool[
    "remove_liquidity(uint256,uint256[3],bool)"
  ](),
  allow.mainnet.curve.crvUsdtWbtcWethPool[
    "remove_liquidity_one_coin(uint256,uint256,uint256,bool)"
  ](),
  ...allowErc20Approve(
    [contracts.mainnet.curve.crvUsdtWbtcWethPool],
    [contracts.mainnet.curve.crvUsdtWbtcWethGauge]
  ),
  allow.mainnet.curve.crvUsdtWbtcWethGauge["deposit(uint256)"](),
  allow.mainnet.curve.crvUsdtWbtcWethGauge["withdraw(uint256)"](),

  // Curve - Tricrypto GHO (GHO/WBTC/wstETH)
  ...allowErc20Approve(
    [GHO, WBTC, wstETH],
    [contracts.mainnet.curve.tricryptoGhoPool]
  ),
  allow.mainnet.curve.tricryptoGhoPool[
    "add_liquidity(uint256[3],uint256,bool)"
  ](),
  allow.mainnet.curve.tricryptoGhoPool[
    "remove_liquidity(uint256,uint256[3],bool)"
  ](),
  allow.mainnet.curve.tricryptoGhoPool[
    "remove_liquidity_one_coin(uint256,uint256,uint256,bool)"
  ](),
  ...allowErc20Approve(
    [contracts.mainnet.curve.tricryptoGhoPool],
    [contracts.mainnet.curve.tricryptoGhoGauge]
  ),
  allow.mainnet.curve.tricryptoGhoGauge["deposit(uint256)"](),
  allow.mainnet.curve.tricryptoGhoGauge["withdraw(uint256)"](),

  // Curve - Deposit and Stake using a special ZAP
  ...allowErc20Approve(
    [GHO, WBTC, wstETH],
    [contracts.mainnet.curve.stakeDepositZap]
  ),
  ...allowErc20Approve(
    [USDT, WBTC, WETH],
    [contracts.mainnet.curve.stakeDepositZap]
  ),
  allow.mainnet.curve.stakeDepositZap[
    "deposit_and_stake(address,address,address,uint256,address[],uint256[],uint256,bool,bool,address)"
  ](
    c.or(
      contracts.mainnet.curve.tricryptoGhoPool,
      contracts.mainnet.curve.crvUsdtWbtcWethPool
    ),
    c.or(
      contracts.mainnet.curve.tricryptoGhoPool,
      contracts.mainnet.curve.crvUsdtWbtcWethPool
    ),
    c.or(
      contracts.mainnet.curve.tricryptoGhoGauge,
      contracts.mainnet.curve.crvUsdtWbtcWethGauge
    ),
    3,
    c.or([GHO, WBTC, wstETH], [USDT, WBTC, eAddress], [USDT, WBTC, WETH]),
    undefined,
    undefined,
    undefined,
    undefined,
    zeroAddress,
    {
      send: true,
    }
  ),

  // Enzyme - Diva stETH Vault
  // Deposit ETH
  allow.mainnet.enzyme.depositWrapper2.exchangeEthAndBuyShares(
    contracts.mainnet.enzyme.divaStEthVault,
    undefined,
    "0xDEF171Fe48CF0115B1d80b88dc8eAB59176FEe57", // Paraswap v5: Augustus Swapper Mainnet
    "0x216B4B4Ba9F3e719726886d34a177484278Bfcae", // Paraswap v5: Token TransferProxy Mainnet
    undefined,
    undefined,
    {
      send: true,
    }
  ),
  // Deposit stETH
  ...allowErc20Approve([stETH], [contracts.mainnet.enzyme.divaStEthVault]),
  allow.mainnet.enzyme.divaStEthVault.buyShares(),
  // Withdraw stETH
  allow.mainnet.enzyme.divaStEthVault.redeemSharesInKind(c.avatar),
  allow.mainnet.enzyme.divaStEthVault.redeemSharesForSpecificAssets(
    c.avatar,
    undefined,
    [stETH]
  ),

  // pods - ETHphoria Vault
  // Deposit ETH
  allow.mainnet.pods.ethAdapter.deposit(
    contracts.mainnet.pods.ethoriaVault,
    c.avatar,
    undefined,
    {
      send: true,
    }
  ),
  // Deposit stETH
  ...allowErc20Approve([stETH], [contracts.mainnet.pods.ethoriaVault]),
  allow.mainnet.pods.ethoriaVault.deposit(undefined, c.avatar),
  // Withdraw stETH
  allow.mainnet.pods.ethoriaVault.redeem(undefined, c.avatar, c.avatar),

  // SAFE - Claim
  allow.mainnet.safe.ecosystemAirdrop.claimVestedTokens(undefined, c.avatar),
  allow.mainnet.safe.userAirdrop.claimVestedTokens(undefined, c.avatar),
  allow.mainnet.safe.userAirdropSep5.claimVestedTokens(undefined, c.avatar),
  // SAFE - Lock
  ...allowErc20Approve([SAFE], [contracts.mainnet.safe.tokenLock]),
  allow.mainnet.safe.tokenLock.lock(),

  // Sky - DSR (DAI Savings Rate)
  // The DsrManager provides an easy to use smart contract that allows
  // service providers to deposit/withdraw dai into the DSR contract pot,
  // and activate/deactivate the Dai Savings Rate to start earning savings
  // on a pool of dai in a single function call.
  // https://docs.makerdao.com/smart-contract-modules/proxy-module/dsr-manager-detailed-documentation#contract-details
  ...allowErc20Approve([DAI], [contracts.mainnet.sky.dsrManager]),
  allow.mainnet.sky.dsrManager.join(c.avatar),
  allow.mainnet.sky.dsrManager.exit(c.avatar),
  allow.mainnet.sky.dsrManager.exitAll(c.avatar),
] satisfies PermissionList
