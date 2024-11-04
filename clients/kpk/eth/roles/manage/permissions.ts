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
  ZERO_ADDRESS,
  E_ADDRESS,
} from "../../../../../eth-sdk/addresses"
import { contracts } from "../../../../../eth-sdk/config"
import { allowErc20Approve } from "../../../../../utils/erc20"
import { PermissionList } from "../../../../../types"

export default [
  /*********************************************
   * DeFi-Kit permissions
   *********************************************/
  // Aave v2 - Staking of AAVE and GHO in Safety Module
  allowAction.aave_v2.stake({ targets: ["AAVE", "GHO"] }),

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

  // CowSwap - Holdings
  allowAction.cowswap.swap({
    sell: [DAI, USDC, USDT],
    buy: [DAI, USDC, USDT, WETH],
  }),
  allowAction.cowswap.swap({ sell: [CRV, COMP, CVX, NOTE], buy: [DAI, USDC] }),

  // Lido
  allowAction.lido.deposit(),

  // Rocket Pool
  allowAction.rocketPool.deposit(),

  // Spark - DSR/sDAI
  allowAction.spark.deposit({ targets: ["DSR_sDAI"] }),

  /*********************************************
   * Typed-presets permissions
   *********************************************/
  // Wrapping and unwrapping of ETH, WETH
  allow.mainnet.weth.withdraw(),
  allow.mainnet.weth.deposit({
    send: true,
  }),

  // Compound v3 - USDC
  ...allowErc20Approve([USDC], [contracts.mainnet.compound_v3.cUSDCv3]),
  allow.mainnet.compound_v3.cUSDCv3.supply(USDC),
  allow.mainnet.compound_v3.cUSDCv3.withdraw(USDC),

  // Compound v3 - Claim rewards
  allow.mainnet.compound_v3.CometRewards.claim(undefined, c.avatar),

  // Curve - USDT/WBTC/WETH
  ...allowErc20Approve(
    [USDT, WBTC, WETH],
    [contracts.mainnet.curve.crvUSDTWBTCWETH_pool]
  ),
  allow.mainnet.curve.crvUSDTWBTCWETH_pool[
    "add_liquidity(uint256[3],uint256,bool)"
  ](undefined, undefined, undefined, {
    send: true,
  }),
  allow.mainnet.curve.crvUSDTWBTCWETH_pool[
    "remove_liquidity(uint256,uint256[3],bool)"
  ](),
  allow.mainnet.curve.crvUSDTWBTCWETH_pool[
    "remove_liquidity_one_coin(uint256,uint256,uint256,bool)"
  ](),
  ...allowErc20Approve(
    [contracts.mainnet.curve.crvUSDTWBTCWETH_pool],
    [contracts.mainnet.curve.crvUSDTWBTCWETH_gauge]
  ),
  allow.mainnet.curve.crvUSDTWBTCWETH_gauge["deposit(uint256)"](),
  allow.mainnet.curve.crvUSDTWBTCWETH_gauge["withdraw(uint256)"](),

  // Curve - Tricrypto GHO (GHO/WBTC/wstETH)
  ...allowErc20Approve(
    [GHO, WBTC, wstETH],
    [contracts.mainnet.curve.tricryptoGHO_pool]
  ),
  allow.mainnet.curve.tricryptoGHO_pool[
    "add_liquidity(uint256[3],uint256,bool)"
  ](),
  allow.mainnet.curve.tricryptoGHO_pool[
    "remove_liquidity(uint256,uint256[3],bool)"
  ](),
  allow.mainnet.curve.tricryptoGHO_pool[
    "remove_liquidity_one_coin(uint256,uint256,uint256,bool)"
  ](),
  ...allowErc20Approve(
    [contracts.mainnet.curve.tricryptoGHO_pool],
    [contracts.mainnet.curve.tricryptoGHO_gauge]
  ),
  allow.mainnet.curve.tricryptoGHO_gauge["deposit(uint256)"](),
  allow.mainnet.curve.tricryptoGHO_gauge["withdraw(uint256)"](),

  // Curve - Deposit and Stake using a special ZAP
  ...allowErc20Approve(
    [GHO, WBTC, wstETH],
    [contracts.mainnet.curve.stake_deposit_zap]
  ),
  ...allowErc20Approve(
    [USDT, WBTC, WETH],
    [contracts.mainnet.curve.stake_deposit_zap]
  ),
  allow.mainnet.curve.stake_deposit_zap[
    "deposit_and_stake(address,address,address,uint256,address[],uint256[],uint256,bool,bool,address)"
  ](
    c.or(
      contracts.mainnet.curve.tricryptoGHO_pool,
      contracts.mainnet.curve.crvUSDTWBTCWETH_pool
    ),
    c.or(
      contracts.mainnet.curve.tricryptoGHO_pool,
      contracts.mainnet.curve.crvUSDTWBTCWETH_pool
    ),
    c.or(
      contracts.mainnet.curve.tricryptoGHO_gauge,
      contracts.mainnet.curve.crvUSDTWBTCWETH_gauge
    ),
    3,
    c.or([GHO, WBTC, wstETH], [USDT, WBTC, E_ADDRESS], [USDT, WBTC, WETH]),
    undefined,
    undefined,
    undefined,
    undefined,
    ZERO_ADDRESS,
    {
      send: true,
    }
  ),

  // Enzyme - Diva stETH Vault
  // Deposit ETH
  allow.mainnet.enzyme.deposit_wrapper_2.exchangeEthAndBuyShares(
    contracts.mainnet.enzyme.Diva_stETH_Vault,
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
  ...allowErc20Approve([stETH], [contracts.mainnet.enzyme.Diva_stETH_Vault]),
  allow.mainnet.enzyme.Diva_stETH_Vault.buyShares(),
  // Withdraw stETH
  allow.mainnet.enzyme.Diva_stETH_Vault.redeemSharesInKind(c.avatar),
  allow.mainnet.enzyme.Diva_stETH_Vault.redeemSharesForSpecificAssets(
    c.avatar,
    undefined,
    [stETH]
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

  // pods - ETHphoria Vault
  // Deposit ETH
  allow.mainnet.pods.ETHAdapter.deposit(
    contracts.mainnet.pods.ETHoriaVault,
    c.avatar,
    undefined,
    {
      send: true,
    }
  ),
  // Deposit stETH
  ...allowErc20Approve([stETH], [contracts.mainnet.pods.ETHoriaVault]),
  allow.mainnet.pods.ETHoriaVault.deposit(undefined, c.avatar),
  // Withdraw stETH
  allow.mainnet.pods.ETHoriaVault.redeem(undefined, c.avatar, c.avatar),

  // SAFE - Claim
  allow.mainnet.safe.ecosystem_airdrop.claimVestedTokens(undefined, c.avatar),
  allow.mainnet.safe.user_airdrop.claimVestedTokens(undefined, c.avatar),
  allow.mainnet.safe.user_airdrop_sep5.claimVestedTokens(undefined, c.avatar),
  // SAFE - Lock
  ...allowErc20Approve([SAFE], [contracts.mainnet.safe.token_lock]),
  allow.mainnet.safe.token_lock.lock(),
] satisfies PermissionList
