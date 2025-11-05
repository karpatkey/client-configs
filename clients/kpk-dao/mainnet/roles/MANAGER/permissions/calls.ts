import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import {
  cbBTC,
  DAI,
  eETH,
  EURC,
  GHO,
  liquidETH,
  SAFE,
  SPK,
  stETH,
  USDC,
  USDT,
  WBTC,
  weETH,
  WETH,
  wstETH,
  gearbox,
  kpk,
  morpho,
} from "@/addresses/eth"
import { zeroAddress, eAddress } from "@/addresses"
import { contracts } from "@/contracts"
import {
  allowErc20Approve,
  allowEthTransfer,
  allowErc20Transfer,
} from "@/helpers"
import { PermissionList } from "@/types"
import { Parameters } from "../../../parameters"
import {
  kpkGc,
  kfPaymentsEth,
  kpkDaoPaymentsEth,
  vcbGc,
  lidoVestingEscrow,
} from "../../../addresses"
import { encodeBytes32String } from "defi-kit"

export default (parameters: Parameters) =>
  [
    // Wrapping and unwrapping of ETH, WETH
    allow.mainnet.weth.withdraw(),
    allow.mainnet.weth.deposit({
      send: true,
    }),

    // Aave - ACI (Aave Chan Initiative) - Aave Stream Collector - Claim aEthLidoGHO
    allow.mainnet.aaveV3.aaveCollectorV2.withdrawFromStream(),
    // Aave v3 Prime Market - Withdraw GHO
    allow.mainnet.aaveV3.poolPrimeV3.withdraw(GHO, undefined, c.avatar),

    // Aura - Claim all rewards
    allow.mainnet.aura.claimZapV3.claimRewards(),

    // Convex - Claim all rewards
    allow.mainnet.convex.claimZap.claimRewards(),

    // Curve - USDT/WBTC/WETH
    allowErc20Approve(
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
    allowErc20Approve(
      [contracts.mainnet.curve.crvUsdtWbtcWethPool],
      [contracts.mainnet.curve.crvUsdtWbtcWethGauge]
    ),
    allow.mainnet.curve.crvUsdtWbtcWethGauge["deposit(uint256)"](),
    allow.mainnet.curve.crvUsdtWbtcWethGauge["withdraw(uint256)"](),
    allow.mainnet.curve.crvUsdtWbtcWethGauge["claim_rewards()"](),
    allow.mainnet.curve.crvMinter.mint(
      contracts.mainnet.curve.crvUsdtWbtcWethGauge
    ),

    // Curve - Tricrypto GHO (GHO/cbBTC/ETH)
    allowErc20Approve(
      [GHO, cbBTC, WETH],
      [contracts.mainnet.curve.btcGhoEthPool]
    ),
    allow.mainnet.curve.btcGhoEthPool["add_liquidity(uint256[3],uint256,bool)"](
      undefined,
      undefined,
      undefined,
      {
        send: true,
      }
    ),
    allow.mainnet.curve.btcGhoEthPool[
      "remove_liquidity(uint256,uint256[3],bool)"
    ](),
    allow.mainnet.curve.btcGhoEthPool[
      "remove_liquidity_one_coin(uint256,uint256,uint256,bool)"
    ](),
    allowErc20Approve(
      [contracts.mainnet.curve.btcGhoEthPool],
      [contracts.mainnet.curve.btcGhoEthGauge]
    ),
    allow.mainnet.curve.btcGhoEthGauge["deposit(uint256)"](),
    allow.mainnet.curve.btcGhoEthGauge["withdraw(uint256)"](),
    allow.mainnet.curve.btcGhoEthGauge["claim_rewards()"](),
    allow.mainnet.curve.crvMinter.mint(contracts.mainnet.curve.btcGhoEthGauge),

    // Curve - Deposit and Stake using a special ZAP
    allowErc20Approve(
      [cbBTC, GHO, WETH],
      [contracts.mainnet.curve.stakeDepositZap]
    ),
    allowErc20Approve(
      [USDT, WBTC, WETH],
      [contracts.mainnet.curve.stakeDepositZap]
    ),
    allow.mainnet.curve.stakeDepositZap[
      "deposit_and_stake(address,address,address,uint256,address[],uint256[],uint256,bool,bool,address)"
    ](
      c.or(
        contracts.mainnet.curve.btcGhoEthPool,
        contracts.mainnet.curve.crvUsdtWbtcWethPool
      ),
      c.or(
        contracts.mainnet.curve.btcGhoEthPool,
        contracts.mainnet.curve.crvUsdtWbtcWethPool
      ),
      c.or(
        contracts.mainnet.curve.btcGhoEthGauge,
        contracts.mainnet.curve.crvUsdtWbtcWethGauge
      ),
      3,
      c.or(
        [GHO, cbBTC, eAddress],
        [GHO, cbBTC, WETH],
        [USDT, WBTC, eAddress],
        [USDT, WBTC, WETH]
      ),
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
    // // Deposit ETH
    // allow.mainnet.enzyme.depositWrapper2.exchangeEthAndBuyShares(
    //   contracts.mainnet.enzyme.divaStEthVault,
    //   undefined,
    //   "0xDEF171Fe48CF0115B1d80b88dc8eAB59176FEe57", // Paraswap v5: Augustus Swapper Mainnet
    //   "0x216B4B4Ba9F3e719726886d34a177484278Bfcae", // Paraswap v5: Token TransferProxy Mainnet
    //   undefined,
    //   undefined,
    //   {
    //     send: true,
    //   }
    // ),
    // Deposit stETH
    allowErc20Approve([stETH], [contracts.mainnet.enzyme.divaStEthVault]),
    allow.mainnet.enzyme.divaStEthVault.buyShares(),
    // Withdraw stETH
    allow.mainnet.enzyme.divaStEthVault.redeemSharesInKind(
      c.avatar,
      undefined,
      [],
      []
    ),
    allow.mainnet.enzyme.divaStEthVault.redeemSharesForSpecificAssets(
      c.avatar,
      undefined,
      [stETH]
    ),

    // ether.fi
    // ether.fi - Liquid ETH Yield Vault - Deposit
    allowErc20Approve([eETH, weETH, WETH], [liquidETH]),
    allow.mainnet.etherfi.liquidEthYieldVaultTeller.deposit(
      c.or(eETH, weETH, WETH)
    ),
    // ether.fi - Liquid ETH Yield Vault - Withdraw
    // https://help.ether.fi/en/articles/284654-how-to-withdraw-from-liquid-vaults
    allowErc20Approve([liquidETH], [contracts.mainnet.etherfi.atomicQueue]),
    allow.mainnet.etherfi.atomicQueue.updateAtomicRequest(
      liquidETH,
      c.or(eETH, weETH)
    ),
    // ether.fi - EigenLayer Restaking
    // Stake ETH for eETH
    allow.mainnet.etherfi.liquidityPool["deposit()"]({ send: true }),
    // Request Withdrawal - A Withdraw Request NFT is issued
    allowErc20Approve([eETH], [contracts.mainnet.etherfi.liquidityPool]),
    allow.mainnet.etherfi.liquidityPool.requestWithdraw(c.avatar),
    // Funds can be claimed once the request is finalized
    allow.mainnet.etherfi.withdrawRequestNft.claimWithdraw(),
    // Stake ETH for weETH
    allow.mainnet.etherfi.depositAdapter.depositETHForWeETH(undefined, {
      send: true,
    }),
    // ether.fi - Wrap/Unwrap
    // Wrap eETH
    allowErc20Approve([eETH], [contracts.mainnet.etherfi.weEth]),
    allow.mainnet.etherfi.weEth.wrap(),
    // Unwrap weETH
    allow.mainnet.etherfi.weEth.unwrap(),
    // ether.fi - Claim rewards
    allow.mainnet.etherfi.kingDistributor.claim(c.avatar),

    // Gearbox - ETH v3 - Curator: kpk
    allowErc20Approve([WETH], [gearbox.kpkWeth]),
    {
      ...allow.mainnet.gearbox.poolV3.deposit(undefined, c.avatar),
      targetAddress: gearbox.kpkWeth,
    },
    // This is the function called by the UI
    {
      ...allow.mainnet.gearbox.poolV3.depositWithReferral(undefined, c.avatar),
      targetAddress: gearbox.kpkWeth,
    },
    {
      ...allow.mainnet.gearbox.poolV3.redeem(undefined, c.avatar, c.avatar),
      targetAddress: gearbox.kpkWeth,
    },
    // Gearbox - wstETH v3 - Curator: kpk
    allowErc20Approve([wstETH], [gearbox.kpkWstEth]),
    {
      ...allow.mainnet.gearbox.poolV3.deposit(undefined, c.avatar),
      targetAddress: gearbox.kpkWstEth,
    },
    // This is the function called by the UI
    {
      ...allow.mainnet.gearbox.poolV3.depositWithReferral(undefined, c.avatar),
      targetAddress: gearbox.kpkWstEth,
    },
    {
      ...allow.mainnet.gearbox.poolV3.redeem(undefined, c.avatar, c.avatar),
      targetAddress: gearbox.kpkWstEth,
    },

    // kpk - USD Prime Fund
    allowErc20Approve([USDC], [kpk.usdPrimeFundShares]),
    {
      ...allow.mainnet.kpk.shares.requestDeposit(
        undefined,
        undefined,
        c.avatar
      ),
      targetAddress: kpk.usdPrimeFundShares,
    },
    {
      ...allow.mainnet.kpk.shares.requestRedeem(
        undefined,
        undefined,
        c.avatar
      ),
      targetAddress: kpk.usdPrimeFundShares,
    },
    // kpk - Renaissance Fund
    allowErc20Approve([USDC], [kpk.renaissanceFundShares]),
    {
      ...allow.mainnet.kpk.shares.requestDeposit(
        undefined,
        undefined,
        c.avatar
      ),
      targetAddress: kpk.renaissanceFundShares,
    },
    {
      ...allow.mainnet.kpk.shares.requestRedeem(
        undefined,
        undefined,
        c.avatar
      ),
      targetAddress: kpk.renaissanceFundShares,
    },

    // Lido - Lido's Token Rewards Plan (TRP) - Claim LDO
    {
      ...allow.mainnet.lido.vestingEscrow["claim(address,uint256)"](c.avatar),
      targetAddress: lidoVestingEscrow,
    },

    // Merkl - ACI Merit Rewards / Morpho Rewards / Gearbox Rewards / ETH+
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

    // Morpho - kpk EURC Vault
    allowErc20Approve([EURC], [morpho.kpkEurc]),
    {
      ...allow.mainnet.morpho.vault.deposit(undefined, c.avatar),
      targetAddress: morpho.kpkEurc,
    },
    {
      ...allow.mainnet.morpho.vault.withdraw(undefined, c.avatar, c.avatar),
      targetAddress: morpho.kpkEurc,
    },
    {
      ...allow.mainnet.morpho.vault.redeem(undefined, c.avatar, c.avatar),
      targetAddress: morpho.kpkEurc,
    },
    // Morpho - kpk USDC Prime Vault
    allowErc20Approve([USDC], [morpho.kpkUsdc]),
    {
      ...allow.mainnet.morpho.vault.deposit(undefined, c.avatar),
      targetAddress: morpho.kpkUsdc,
    },
    {
      ...allow.mainnet.morpho.vault.withdraw(undefined, c.avatar, c.avatar),
      targetAddress: morpho.kpkUsdc,
    },
    {
      ...allow.mainnet.morpho.vault.redeem(undefined, c.avatar, c.avatar),
      targetAddress: morpho.kpkUsdc,
    },
    // Morpho - Claim Rewards
    allow.mainnet.morpho.universalRewardsDistributor.claim(c.avatar),

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
    allowErc20Approve([stETH], [contracts.mainnet.pods.ethoriaVault]),
    allow.mainnet.pods.ethoriaVault.deposit(undefined, c.avatar),
    // Withdraw stETH
    allow.mainnet.pods.ethoriaVault.redeem(undefined, c.avatar, c.avatar),

    // SAFE - Claim
    allow.mainnet.safe.ecosystemAirdrop.claimVestedTokens(undefined, c.avatar),
    allow.mainnet.safe.userAirdrop.claimVestedTokens(undefined, c.avatar),
    allow.mainnet.safe.userAirdropSep5.claimVestedTokens(undefined, c.avatar),
    // SAFE - Lock
    allowErc20Approve([SAFE], [contracts.mainnet.safe.tokenLock]),
    allow.mainnet.safe.tokenLock.lock(),

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

    // Spark - Stake/Unstake SPK
    allowErc20Approve([SPK], [contracts.mainnet.spark.stSpk]),
    allow.mainnet.spark.stSpk.deposit(c.avatar),
    allow.mainnet.spark.stSpk.withdraw(c.avatar),
    allow.mainnet.spark.stSpk.redeem(c.avatar),
    allow.mainnet.spark.stSpk.claim(c.avatar),
    allow.mainnet.spark.stSpk.claimBatch(c.avatar),

    /*********************************************
     * Bridge
     *********************************************/
    // Mainnet -> Gnosis
    // DAI (Mainnet) -> XDAI (Gnosis) - Gnosis Bridge - 600K per month to vcbGc
    allowErc20Approve([DAI], [contracts.mainnet.gnosisBridge.xdaiUsdsBridge]),
    // Bridge up tp 600K DAI to vcbGc per month
    allow.mainnet.gnosisBridge.xdaiUsdsBridge.relayTokens(
      DAI,
      vcbGc,
      c.withinAllowance(encodeBytes32String("DAI_VCB-GC") as `0x${string}`)
    ),
    // Bridge DAI to kpkGc without restriction
    allow.mainnet.gnosisBridge.xdaiUsdsBridge.relayTokens(DAI, kpkGc),
    // Claim bridged XDAI from Gnosis
    allow.mainnet.gnosisBridge.xdaiUsdsBridge.executeSignatures(
      c.and(
        // Avatar address
        c.bitmask({
          shift: 0,
          mask: "0xffffffffffffffffffff",
          value: parameters.avatar.slice(0, 22), // First 10 bytes of the avatar address
        }),
        c.bitmask({
          shift: 10,
          mask: "0xffffffffffffffffffff",
          value: "0x" + parameters.avatar.slice(22, 42), // Last 10 bytes of the avatar address
        }),
        // skip 32 bytes corresponding to the amount
        // skip 32 bytes corresponding to the nonce
        // Recipient address: xDai Bridge
        c.bitmask({
          shift: 20 + 32 + 32,
          mask: "0xffffffffffffffffffff",
          value: contracts.mainnet.gnosisBridge.gnoXdaiBridge.slice(0, 22), // First 10 bytes of the xDai Bridge
        }),
        c.bitmask({
          shift: 20 + 32 + 32 + 10,
          mask: "0xffffffffffffffffffff",
          value:
            "0x" + contracts.mainnet.gnosisBridge.gnoXdaiBridge.slice(22, 42), // Last 10 bytes of the xDai Bridge
        })
      )
    ),

    /*********************************************
     * Transfers
     *********************************************/
    // Transfer 100K per month to kpkDaoPaymentsEth
    allowErc20Transfer([DAI], [kpkDaoPaymentsEth], "DAI_KPK-PAYMENTS-ETH"),

    // Transfer 10 ETH per month to kpkDaoPaymentsEth
    // allowErc20Transfer([WETH], [kpkDaoPaymentsEth], "ETH_KPK-PAYMENTS-ETH"),
    allowEthTransfer(kpkDaoPaymentsEth, "ETH_KPK-PAYMENTS-ETH"),

    // Transfer 200K per month to kfPaymentsEth
    allowErc20Transfer([USDC], [kfPaymentsEth], "USDC_KPK-PAYMENTS-ETH"),

    // Transfer 100K per month to kpkDaoPaymentsEth
    allowErc20Transfer(
      [USDC],
      [kpkDaoPaymentsEth],
      "USDC_KPK_DAO-PAYMENTS-ETH"
    ),

    // Transfer 100K per month to kpkDaoPaymentsEth
    allowErc20Transfer(
      [USDT],
      [kpkDaoPaymentsEth],
      "USDT_KPK_DAO-PAYMENTS-ETH"
    ),

    // Transfer 100K per month to kpkDaoPaymentsEth
    allowErc20Transfer([GHO], [kpkDaoPaymentsEth], "GHO_KPK_DAO-PAYMENTS-ETH"),
  ] satisfies PermissionList
