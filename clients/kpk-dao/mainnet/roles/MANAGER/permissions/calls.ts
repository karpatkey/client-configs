import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import {
  DAI,
  eETH,
  GHO,
  USDT,
  SAFE,
  stETH,
  WBTC,
  weETH,
  WETH,
  wstETH,
  cbBTC,
} from "@/addresses/eth"
import { zeroAddress, eAddress } from "@/addresses"
import { contracts } from "@/contracts"
import { allowErc20Approve } from "@/helpers"
import { PermissionList } from "@/types"
import { Parameters } from "../../../parameters"
import {
  kfPaymentsMainnet,
  kpkDaoPaymentsMainnet,
  vcbGC,
} from "../../addresses"
import { withinAllowance } from "zodiac-roles-sdk/build/cjs/sdk/src/permissions/authoring/conditions"
import { encodeBytes32String } from "defi-kit"

export default (parameters: Parameters) =>
  [
    /*********************************************
     * Typed-presets permissions
     *********************************************/
    // Wrapping and unwrapping of ETH, WETH
    allow.mainnet.weth.withdraw(),
    allow.mainnet.weth.deposit({
      send: true,
    }),

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
      [contracts.mainnet.curve.ghoBtcWstePool]
    ),
    allow.mainnet.curve.ghoBtcWstePool[
      "add_liquidity(uint256[3],uint256,bool)"
    ](),
    allow.mainnet.curve.ghoBtcWstePool[
      "remove_liquidity(uint256,uint256[3],bool)"
    ](),
    allow.mainnet.curve.ghoBtcWstePool[
      "remove_liquidity_one_coin(uint256,uint256,uint256,bool)"
    ](),
    ...allowErc20Approve(
      [contracts.mainnet.curve.ghoBtcWstePool],
      [contracts.mainnet.curve.ghoBtcWsteGauge]
    ),
    allow.mainnet.curve.ghoBtcWsteGauge["deposit(uint256)"](),
    allow.mainnet.curve.ghoBtcWsteGauge["withdraw(uint256)"](),

    // Curve - Tricrypto GHO (GHO/cbBTC/ETH)
    ...allowErc20Approve(
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
    ...allowErc20Approve(
      [contracts.mainnet.curve.btcGhoEthPool],
      [contracts.mainnet.curve.btcGhoEthGauge]
    ),
    allow.mainnet.curve.btcGhoEthGauge["deposit(uint256)"](),
    allow.mainnet.curve.btcGhoEthGauge["withdraw(uint256)"](),

    // Curve - Deposit and Stake using a special ZAP
    ...allowErc20Approve(
      [cbBTC, GHO, WETH],
      [contracts.mainnet.curve.stakeDepositZap]
    ),
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
        contracts.mainnet.curve.btcGhoEthPool,
        contracts.mainnet.curve.ghoBtcWstePool,
        contracts.mainnet.curve.crvUsdtWbtcWethPool
      ),
      c.or(
        contracts.mainnet.curve.btcGhoEthPool,
        contracts.mainnet.curve.ghoBtcWstePool,
        contracts.mainnet.curve.crvUsdtWbtcWethPool
      ),
      c.or(
        contracts.mainnet.curve.btcGhoEthGauge,
        contracts.mainnet.curve.ghoBtcWsteGauge,
        contracts.mainnet.curve.crvUsdtWbtcWethGauge
      ),
      3,
      c.or(
        [GHO, cbBTC, eAddress],
        [GHO, cbBTC, WETH],
        [GHO, WBTC, wstETH],
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
    ...allowErc20Approve([stETH], [contracts.mainnet.enzyme.divaStEthVault]),
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

    // ether.fi - Liquid ETH - Deposit
    ...allowErc20Approve(
      [eETH, weETH, WETH],
      [contracts.mainnet.etherfi.liquidEth]
    ),
    allow.mainnet.etherfi.tellerWithMultiAssetSupport.deposit(
      c.or(eETH, weETH, WETH)
    ),
    // ether.fi - Liquid ETH - Withdraw
    ...allowErc20Approve(
      [contracts.mainnet.etherfi.liquidEth],
      [contracts.mainnet.etherfi.atomicQueue]
    ),
    allow.mainnet.etherfi.atomicQueue.updateAtomicRequest(
      contracts.mainnet.etherfi.liquidEth,
      c.or(eETH, weETH)
    ),

    // Merkl (Angle) - Claim
    allow.mainnet.merkl.angleDistributor.claim([parameters.avatar], [GHO]),

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

    /*********************************************
     * Bridge
     *********************************************/
    // NAV Calculator - bridgeStart - In the future, the bridged assets should be scoped appropriately.
    allow.mainnet.navCalculator.bridgeStart(),

    // Mainnet -> Gnosis
    // DAI -> XDAI
    ...allowErc20Approve([DAI], [contracts.mainnet.gnoXdaiBridge]),
    allow.mainnet.gnoXdaiBridge.relayTokens(
      vcbGC,
      withinAllowance(encodeBytes32String("DAI_VCB-GC") as `0x${string}`)
    ),

    /*********************************************
     * Transfers
     *********************************************/
    allow.mainnet.dai.transfer(
      kpkDaoPaymentsMainnet,
      withinAllowance(
        encodeBytes32String("DAI_KPK-PAYMENTS-ETH") as `0x${string}`
      )
    ),

    allow.mainnet.dai.transfer(
      kpkDaoPaymentsMainnet,
      withinAllowance(
        encodeBytes32String("DAI_KPK-PAYMENTS-ETH") as `0x${string}`
      )
    ),

    {
      targetAddress: kpkDaoPaymentsMainnet,
      selector: "0x00000000",
      send: true,
      condition: c.etherWithinAllowance(
        encodeBytes32String("ETH_KPK-PAYMENTS-ETH") as `0x${string}`
      ),
    },
  ] satisfies PermissionList
