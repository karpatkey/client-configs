import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import {
  AURA,
  BAL,
  COMP,
  COW,
  CRV,
  CVX,
  DAI,
  ETHx,
  GHO,
  GNO,
  LDO,
  OETH,
  OGN,
  osETH,
  rETH,
  RPL,
  SAFE,
  sDAI,
  SKY,
  stETH,
  sUSDS,
  SWISE,
  UNI,
  USDC,
  USDS,
  USDT,
  WETH,
  wstETH,
  x3CRV,
  aura,
  balancerV2,
  balancerV3,
  curve,
  uniswapV2,
} from "@/addresses/eth"
import { zeroAddress, eAddress } from "@/addresses"
import { contracts } from "@/contracts"
import { allowErc20Approve } from "@/helpers"
import { PermissionList } from "@/types"
import { Parameters } from "../../../parameters"

export default (parameters: Parameters) =>
  [
    // Wrapping and unwrapping of ETH, WETH
    allow.mainnet.weth.withdraw(),
    allow.mainnet.weth.deposit({
      send: true,
    }),

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

    // Balancer v2 - BCoW-50WETH-50USDC
    allowErc20Approve(
      [USDC, WETH],
      [contracts.mainnet.balancerV2.bCow50Weth50Usdc]
    ),
    allow.mainnet.balancerV2.bCow50Weth50Usdc.joinPool(),
    allow.mainnet.balancerV2.bCow50Weth50Usdc.exitPool(),
    allowErc20Approve(
      [contracts.mainnet.balancerV2.bCow50Weth50Usdc],
      [balancerV2.bCow50Weth50UsdcGauge]
    ),
    {
      ...allow.mainnet.balancerV2.gauge["deposit(uint256)"](),
      targetAddress: balancerV2.bCow50Weth50UsdcGauge
    },
    {
      ...allow.mainnet.balancerV2.gauge["withdraw(uint256)"](),
      targetAddress: balancerV2.bCow50Weth50UsdcGauge
    },
    {
      ...allow.mainnet.balancerV2.gauge["claim_rewards()"](),
      targetAddress: balancerV2.bCow50Weth50UsdcGauge
    },
    allow.mainnet.balancerV2.minter.mint(
      balancerV2.bCow50Weth50UsdcGauge
    ),

    // Balancer v2 - BCoW-50SAFE-50WETH (Staking not available)
    allowErc20Approve(
      [SAFE, WETH],
      [contracts.mainnet.balancerV2.bCow50Safe50Weth]
    ),
    allow.mainnet.balancerV2.bCow50Safe50Weth.joinPool(),
    allow.mainnet.balancerV2.bCow50Safe50Weth.exitPool(),

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
      targetAddress: balancerV3.aaveLidoWethWstEthGauge
    },
    {
      ...allow.mainnet.balancerV2.gauge["withdraw(uint256)"](),
      targetAddress: balancerV3.aaveLidoWethWstEthGauge
    },
    {
      ...allow.mainnet.balancerV2.gauge["claim_rewards()"](),
      targetAddress: balancerV3.aaveLidoWethWstEthGauge
    },
    allow.mainnet.balancerV2.minter.mint(
      balancerV3.aaveLidoWethWstEthGauge
    ),

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
    allowErc20Approve(
      [balancerV3.ethxWaWeth],
      [balancerV3.ethxWaWethGauge]
    ),
    {
      ...allow.mainnet.balancerV2.gauge["deposit(uint256)"](),
      targetAddress: balancerV3.ethxWaWethGauge
    },
    {
      ...allow.mainnet.balancerV2.gauge["withdraw(uint256)"](),
      targetAddress: balancerV3.ethxWaWethGauge
    },
    {
      ...allow.mainnet.balancerV2.gauge["claim_rewards()"](),
      targetAddress: balancerV3.ethxWaWethGauge
    },
    allow.mainnet.balancerV2.minter.mint(
      balancerV3.ethxWaWethGauge
    ),

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
    allowErc20Approve(
      [balancerV3.osEthWaWeth],
      [balancerV3.osEthWaWethGauge]
    ),
    {
      ...allow.mainnet.balancerV2.gauge["deposit(uint256)"](),
      targetAddress: balancerV3.osEthWaWethGauge
    },
    {
      ...allow.mainnet.balancerV2.gauge["withdraw(uint256)"](),
      targetAddress: balancerV3.osEthWaWethGauge
    },
    {
      ...allow.mainnet.balancerV2.gauge["claim_rewards()"](),
      targetAddress: balancerV3.osEthWaWethGauge
    },
    allow.mainnet.balancerV2.minter.mint(
      balancerV3.osEthWaWethGauge
    ),

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

    // Curve - WETH/rETH
    allowErc20Approve([WETH, rETH], [contracts.mainnet.curve.wethRethPool]),
    allow.mainnet.curve.wethRethPool["add_liquidity(uint256[],uint256)"](),
    allow.mainnet.curve.wethRethPool["remove_liquidity(uint256,uint256[])"](),
    allow.mainnet.curve.wethRethPool[
      "remove_liquidity_one_coin(uint256,int128,uint256)"
    ](),
    allow.mainnet.curve.wethRethPool[
      "remove_liquidity_imbalance(uint256[],uint256)"
    ](),
    allowErc20Approve(
      [contracts.mainnet.curve.wethRethPool],
      [contracts.mainnet.curve.wethRethGauge]
    ),
    allow.mainnet.curve.wethRethGauge["deposit(uint256)"](),
    allow.mainnet.curve.wethRethGauge["withdraw(uint256)"](),
    allow.mainnet.curve.wethRethGauge["withdraw(uint256,bool)"](),
    allow.mainnet.curve.wethRethGauge["claim_rewards()"](),
    allow.mainnet.curve.crvMinter.mint(contracts.mainnet.curve.wethRethGauge),

    // Curve - Deposit and Stake using a special ZAP
    allowErc20Approve(
      [DAI, OETH, osETH, rETH, stETH, USDC, USDT, WETH],
      [contracts.mainnet.curve.stakeDepositZap]
    ),
    allow.mainnet.curve.stakeDepositZap[
      "deposit_and_stake(address,address,address,uint256,address[],uint256[],uint256,bool,bool,address)"
    ](
      c.or(
        contracts.mainnet.curve.x3CrvPool,
        contracts.mainnet.curve.steCrvPool,
        contracts.mainnet.curve.oEthCrvPool,
        contracts.mainnet.curve.osEthRethPool,
        contracts.mainnet.curve.wethRethPool
      ),
      c.or(
        x3CRV,
        curve.steCrv,
        contracts.mainnet.curve.oEthCrvPool,
        contracts.mainnet.curve.osEthRethPool,
        contracts.mainnet.curve.wethRethPool
      ),
      c.or(
        contracts.mainnet.curve.x3CrvGauge,
        contracts.mainnet.curve.steCrvPoolGauge,
        contracts.mainnet.curve.oEthCrvGauge,
        contracts.mainnet.curve.osEthRethGauge,
        contracts.mainnet.curve.wethRethGauge
      ),
      c.or(2, 3),
      c.or(
        [DAI, USDC, USDT],
        [eAddress, stETH],
        [eAddress, OETH],
        [osETH, rETH],
        [WETH, rETH]
      ),
      undefined,
      undefined,
      undefined,
      undefined,
      zeroAddress,
      { send: true }
    ),

    // Origin - Mint OETH
    allow.mainnet.origin.oEthZapper.deposit({ send: true }),
    // Opt into yield
    allow.mainnet.origin.oEth.rebaseOptIn(),
    // Origin - Redeem via OETH Vault
    // OETH is burnt by the user so no approval is needed
    allow.mainnet.origin.oEthVault.requestWithdrawal(),
    allow.mainnet.origin.oEthVault.claimWithdrawal(),
    allow.mainnet.origin.oEthVault.claimWithdrawals(),

    // Uniswap v2 - ETH/SAFE
    allowErc20Approve([SAFE], [contracts.mainnet.uniswapV2.router2]),
    allow.mainnet.uniswapV2.router2.addLiquidityETH(
      SAFE,
      undefined,
      undefined,
      undefined,
      c.avatar,
      undefined,
      {
        send: true,
      }
    ),
    allowErc20Approve(
      [uniswapV2.safeEth],
      [contracts.mainnet.uniswapV2.router2]
    ),
    allow.mainnet.uniswapV2.router2.removeLiquidityETH(
      SAFE,
      undefined,
      undefined,
      undefined,
      c.avatar
    ),

    // Uniswap v2 - ETH/USDC
    allowErc20Approve([USDC], [contracts.mainnet.uniswapV2.router2]),
    allow.mainnet.uniswapV2.router2.addLiquidityETH(
      USDC,
      undefined,
      undefined,
      undefined,
      c.avatar,
      undefined,
      {
        send: true,
      }
    ),
    allowErc20Approve(
      [uniswapV2.usdcEth],
      [contracts.mainnet.uniswapV2.router2]
    ),
    allow.mainnet.uniswapV2.router2.removeLiquidityETH(
      USDC,
      undefined,
      undefined,
      undefined,
      c.avatar
    ),

    // Uniswap v2 - ETH/USDT
    allowErc20Approve([USDT], [contracts.mainnet.uniswapV2.router2]),
    allow.mainnet.uniswapV2.router2.addLiquidityETH(
      USDT,
      undefined,
      undefined,
      undefined,
      c.avatar,
      undefined,
      {
        send: true,
      }
    ),
    allowErc20Approve(
      [uniswapV2.usdtEth],
      [contracts.mainnet.uniswapV2.router2]
    ),
    allow.mainnet.uniswapV2.router2.removeLiquidityETH(
      USDT,
      undefined,
      undefined,
      undefined,
      c.avatar
    ),

    // Uniswap v3 - SAFE + WETH - Fees [0.3%, 1%]
    allow.mainnet.uniswapV3.positionsNft.createAndInitializePoolIfNecessary(
      c.or(SAFE, WETH),
      c.or(SAFE, WETH),
      c.or(3000, 10000)
    ),
    // Uniswap v3 - SAFE + USDC - Fees [0.3%, 1%]
    allow.mainnet.uniswapV3.positionsNft.createAndInitializePoolIfNecessary(
      c.or(SAFE, USDC),
      c.or(SAFE, USDC),
      c.or(3000, 10000)
    ),
    // Uniswap v3 - SAFE + USDT - Fees [0.3%, 1%]
    allow.mainnet.uniswapV3.positionsNft.createAndInitializePoolIfNecessary(
      c.or(SAFE, USDT),
      c.or(SAFE, USDT),
      c.or(3000, 10000)
    ),
    // Uniswap v3 - WETH + USDC - Fees [0.05%, 0.3%]
    allow.mainnet.uniswapV3.positionsNft.createAndInitializePoolIfNecessary(
      c.or(WETH, USDC),
      c.or(WETH, USDC),
      c.or(500, 3000)
    ),
    // Uniswap v3 - WETH + USDT - Fees [0.05%, 0.3%]
    allow.mainnet.uniswapV3.positionsNft.createAndInitializePoolIfNecessary(
      c.or(WETH, USDT),
      c.or(WETH, USDT),
      c.or(500, 3000)
    ),

    /*********************************************
     * SWAPS
     *********************************************/
    // Uniswap v3 - [AURA, BAL, COMP, COW, CRV, CVX, DAI, ETHx, GHO, GNO, LDO, OETH, OGN, osETH, rETH, RPL, SAFE, sDAI, SKY, SPK, stETH, sUSDS, SWISE, UNI, USDC, USDS, USDT, WETH, wstETH] ->
    // [DAI, ETHx, GHO, GNO, OETH, osETH, rETH, SAFE, sDAI, stETH, sUSDS, USDC, USDS, USDT, WETH, wstETH]
    allowErc20Approve(
      [
        AURA,
        BAL,
        COMP,
        COW,
        CRV,
        CVX,
        DAI,
        ETHx,
        GHO,
        GNO,
        LDO,
        OETH,
        OGN,
        osETH,
        rETH,
        RPL,
        SAFE,
        sDAI,
        SKY,
        // SPK seems that is not deployed yet https://docs.spark.fi/governance/spk-token,
        stETH,
        sUSDS,
        SWISE,
        UNI,
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
        AURA,
        BAL,
        COMP,
        COW,
        CRV,
        CVX,
        DAI,
        ETHx,
        GHO,
        GNO,
        LDO,
        OETH,
        OGN,
        osETH,
        rETH,
        RPL,
        SAFE,
        sDAI,
        SKY,
        // SPK seems that is not deployed yet https://docs.spark.fi/governance/spk-token,
        stETH,
        sUSDS,
        SWISE,
        UNI,
        USDC,
        USDS,
        USDT,
        WETH,
        wstETH
      ),
      tokenOut: c.or(
        DAI,
        ETHx,
        GHO,
        GNO,
        OETH,
        osETH,
        rETH,
        SAFE,
        stETH,
        sDAI,
        sUSDS,
        USDC,
        USDS,
        USDT,
        WETH,
        wstETH
      ),
      recipient: c.avatar,
    }),

    /*********************************************
     * Bridge
     *********************************************/
    // Mainnet -> Gnosis
    // DAI -> XDAI - Gnosis Bridge
    allowErc20Approve([DAI], [contracts.mainnet.gnosisBridge.xdaiUsdsBridge]),
    allow.mainnet.gnosisBridge.xdaiUsdsBridge.relayTokens(DAI, c.avatar),
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

    // ETH -> WETH - Gnosis Bridge
    allow.mainnet.gnosisBridge.wethOmnibridgeRouter[
      "wrapAndRelayTokens(address)"
    ](c.avatar, { send: true }),

    // GNO - Gnosis Bridge
    allowErc20Approve([GNO], [contracts.mainnet.gnosisBridge.gnoOmnibridge]),
    allow.mainnet.gnosisBridge.gnoOmnibridge[
      "relayTokens(address,address,uint256)"
    ](GNO, c.avatar),
    // Claim bridged GNO from Gnosis
    allow.mainnet.gnosisBridge.ambEthXdai.safeExecuteSignaturesWithAutoGasLimit(
      c.and(
        // messageId: 32 bytes
        // First 4 bytes
        c.bitmask({
          shift: 0,
          mask: "0xffffffff",
          value: "0x00050000",
        }),
        // Next 10 bytes
        c.bitmask({
          shift: 4,
          mask: "0xffffffffffffffffffff",
          value: "0xa7823d6f1e31569f5186",
        }),
        // Next 10 bytes
        c.bitmask({
          shift: 4 + 10,
          mask: "0xffffffffffffffffffff",
          value: "0x1e345b30c6bebf70ebe7",
        }),
        // skip last 8 bytes (nonce)
        // sender: 20 bytes
        c.bitmask({
          shift: 32,
          mask: "0xffffffffffffffffffff",
          value: contracts.gnosis.gnosisBridge.xdaiBridge.slice(0, 22), // First 10 bytes of the sender address (XDAI Bridge)
        }),
        c.bitmask({
          shift: 32 + 10,
          mask: "0xffffffffffffffffffff",
          value: "0x" + contracts.gnosis.gnosisBridge.xdaiBridge.slice(22, 42), // Second 10 bytes of the sender address (XDAI Bridge)
        }),
        // executor: 20 bytes
        c.bitmask({
          shift: 32 + 20,
          mask: "0xffffffffffffffffffff",
          value: contracts.mainnet.gnosisBridge.gnoOmnibridge.slice(0, 22), // First 10 bytes of the executor address (Omnibridge)
        }),
        c.bitmask({
          shift: 32 + 20 + 10,
          mask: "0xffffffffffffffffffff",
          value:
            "0x" + contracts.mainnet.gnosisBridge.gnoOmnibridge.slice(22, 42), // Second 10 bytes of the executor address (Omnibridge)
        }),
        // gasLimit: 4 bytes
        c.bitmask({
          shift: 32 + 20 + 20,
          mask: "0xffffffff",
          value: "0x000927c0",
        }),
        // dataType + chainIds: 5 bytes
        c.bitmask({
          shift: 32 + 20 + 20 + 4,
          mask: "0xffffffffff",
          value: "0x0101806401",
        }),
        // selector (handleNativeTokens): 4 bytes
        c.bitmask({
          shift: 32 + 20 + 20 + 4 + 5,
          mask: "0xffffffff",
          value: "0x272255bb",
        }),
        // skip the first 12 bytes (0's) of the address and scope the first 10 bytes
        // Token address
        c.bitmask({
          shift: 32 + 20 + 20 + 4 + 5 + 4 + 12,
          mask: "0xffffffffffffffffffff",
          value: GNO.slice(0, 22), // First 10 bytes of the token address
        }),
        c.bitmask({
          shift: 32 + 20 + 20 + 4 + 5 + 4 + 12 + 10,
          mask: "0xffffffffffffffffffff",
          value: "0x" + GNO.slice(22, 42), // Last 10 bytes of the token address
        }),
        // skip the first 12 bytes (0's) of the address and scope the first 10 bytes
        // Avatar address
        c.bitmask({
          shift: 32 + 20 + 20 + 4 + 5 + 4 + 32 + 12,
          mask: "0xffffffffffffffffffff",
          value: parameters.avatar.slice(0, 22), // First 10 bytes of the avatar address
        }),
        c.bitmask({
          shift: 32 + 20 + 20 + 4 + 5 + 4 + 32 + 12 + 10,
          mask: "0xffffffffffffffffffff",
          value: "0x" + parameters.avatar.slice(22, 42), // Last 10 bytes of the avatar address
        })
      )
    ),

    // SAFE - Gnosis Bridge
    allowErc20Approve([SAFE], [contracts.mainnet.gnosisBridge.gnoOmnibridge]),
    allow.mainnet.gnosisBridge.gnoOmnibridge[
      "relayTokens(address,address,uint256)"
    ](SAFE, c.avatar),
    // Claim bridged SAFE from Gnosis
    allow.mainnet.gnosisBridge.ambEthXdai.safeExecuteSignaturesWithAutoGasLimit(
      c.and(
        // messageId: 32 bytes
        // First 4 bytes
        c.bitmask({
          shift: 0,
          mask: "0xffffffff",
          value: "0x00050000",
        }),
        // Next 10 bytes
        c.bitmask({
          shift: 4,
          mask: "0xffffffffffffffffffff",
          value: "0xa7823d6f1e31569f5186",
        }),
        // Next 10 bytes
        c.bitmask({
          shift: 4 + 10,
          mask: "0xffffffffffffffffffff",
          value: "0x1e345b30c6bebf70ebe7",
        }),
        // skip last 8 bytes (nonce)
        // sender: 20 bytes
        c.bitmask({
          shift: 32,
          mask: "0xffffffffffffffffffff",
          value: contracts.gnosis.gnosisBridge.xdaiBridge.slice(0, 22), // First 10 bytes of the sender address (XDAI Bridge)
        }),
        c.bitmask({
          shift: 32 + 10,
          mask: "0xffffffffffffffffffff",
          value: "0x" + contracts.gnosis.gnosisBridge.xdaiBridge.slice(22, 42), // Second 10 bytes of the sender address (XDAI Bridge)
        }),
        // executor: 20 bytes
        c.bitmask({
          shift: 32 + 20,
          mask: "0xffffffffffffffffffff",
          value: contracts.mainnet.gnosisBridge.gnoOmnibridge.slice(0, 22), // First 10 bytes of the executor address (Omnibridge)
        }),
        c.bitmask({
          shift: 32 + 20 + 10,
          mask: "0xffffffffffffffffffff",
          value:
            "0x" + contracts.mainnet.gnosisBridge.gnoOmnibridge.slice(22, 42), // Second 10 bytes of the executor address (Omnibridge)
        }),
        // gasLimit: 4 bytes
        c.bitmask({
          shift: 32 + 20 + 20,
          mask: "0xffffffff",
          value: "0x000927c0",
        }),
        // dataType + chainIds: 5 bytes
        c.bitmask({
          shift: 32 + 20 + 20 + 4,
          mask: "0xffffffffff",
          value: "0x0101806401",
        }),
        // selector (handleNativeTokens): 4 bytes
        c.bitmask({
          shift: 32 + 20 + 20 + 4 + 5,
          mask: "0xffffffff",
          value: "0x272255bb",
        }),
        // skip the first 12 bytes (0's) of the address and scope the first 10 bytes
        // Token address
        c.bitmask({
          shift: 32 + 20 + 20 + 4 + 5 + 4 + 12,
          mask: "0xffffffffffffffffffff",
          value: SAFE.slice(0, 22), // First 10 bytes of the token address
        }),
        c.bitmask({
          shift: 32 + 20 + 20 + 4 + 5 + 4 + 12 + 10,
          mask: "0xffffffffffffffffffff",
          value: "0x" + SAFE.slice(22, 42), // Last 10 bytes of the token address
        }),
        // skip the first 12 bytes (0's) of the address and scope the first 10 bytes
        // Avatar address
        c.bitmask({
          shift: 32 + 20 + 20 + 4 + 5 + 4 + 32 + 12,
          mask: "0xffffffffffffffffffff",
          value: parameters.avatar.slice(0, 22), // First 10 bytes of the avatar address
        }),
        c.bitmask({
          shift: 32 + 20 + 20 + 4 + 5 + 4 + 32 + 12 + 10,
          mask: "0xffffffffffffffffffff",
          value: "0x" + parameters.avatar.slice(22, 42), // Last 10 bytes of the avatar address
        })
      )
    ),

    // USDC -> USDC.e - Gnosis Bridge
    allowErc20Approve([USDC], [contracts.mainnet.gnosisBridge.gnoOmnibridge]),
    allow.mainnet.gnosisBridge.gnoOmnibridge.relayTokensAndCall(
      USDC,
      contracts.gnosis.gnosisBridge.usdcTransmuter,
      undefined,
      "0x" + parameters.avatar.slice(2).padStart(64, "0")
    ),
    // Claim bridged USDC from Gnosis - Gnosis Bridge
    allow.mainnet.gnosisBridge.ambEthXdai.safeExecuteSignaturesWithAutoGasLimit(
      c.and(
        // messageId: 32 bytes
        // First 4 bytes
        c.bitmask({
          shift: 0,
          mask: "0xffffffff",
          value: "0x00050000",
        }),
        // Next 10 bytes
        c.bitmask({
          shift: 4,
          mask: "0xffffffffffffffffffff",
          value: "0xa7823d6f1e31569f5186",
        }),
        // Next 10 bytes
        c.bitmask({
          shift: 4 + 10,
          mask: "0xffffffffffffffffffff",
          value: "0x1e345b30c6bebf70ebe7",
        }),
        // skip last 8 bytes (nonce)
        // sender: 20 bytes
        c.bitmask({
          shift: 32,
          mask: "0xffffffffffffffffffff",
          value: contracts.gnosis.gnosisBridge.xdaiBridge.slice(0, 22), // First 10 bytes of the sender address (XDAI Bridge)
        }),
        c.bitmask({
          shift: 32 + 10,
          mask: "0xffffffffffffffffffff",
          value: "0x" + contracts.gnosis.gnosisBridge.xdaiBridge.slice(22, 42), // Second 10 bytes of the sender address (XDAI Bridge)
        }),
        // executor: 20 bytes
        c.bitmask({
          shift: 32 + 20,
          mask: "0xffffffffffffffffffff",
          value: contracts.mainnet.gnosisBridge.gnoOmnibridge.slice(0, 22), // First 10 bytes of the executor address (Omnibridge)
        }),
        c.bitmask({
          shift: 32 + 20 + 10,
          mask: "0xffffffffffffffffffff",
          value:
            "0x" + contracts.mainnet.gnosisBridge.gnoOmnibridge.slice(22, 42), // Second 10 bytes of the executor address (Omnibridge)
        }),
        // gasLimit: 4 bytes
        c.bitmask({
          shift: 32 + 20 + 20,
          mask: "0xffffffff",
          value: "0x000927c0",
        }),
        // dataType + chainIds: 5 bytes
        c.bitmask({
          shift: 32 + 20 + 20 + 4,
          mask: "0xffffffffff",
          value: "0x0101806401",
        }),
        // selector (handleNativeTokens): 4 bytes
        c.bitmask({
          shift: 32 + 20 + 20 + 4 + 5,
          mask: "0xffffffff",
          value: "0x272255bb",
        }),
        // skip the first 12 bytes (0's) of the address and scope the first 10 bytes
        // Token address
        c.bitmask({
          shift: 32 + 20 + 20 + 4 + 5 + 4 + 12,
          mask: "0xffffffffffffffffffff",
          value: USDC.slice(0, 22), // First 10 bytes of the token address
        }),
        c.bitmask({
          shift: 32 + 20 + 20 + 4 + 5 + 4 + 12 + 10,
          mask: "0xffffffffffffffffffff",
          value: "0x" + USDC.slice(22, 42), // Last 10 bytes of the token address
        }),
        // skip the first 12 bytes (0's) of the address and scope the first 10 bytes
        // Avatar address
        c.bitmask({
          shift: 32 + 20 + 20 + 4 + 5 + 4 + 32 + 12,
          mask: "0xffffffffffffffffffff",
          value: parameters.avatar.slice(0, 22), // First 10 bytes of the avatar address
        }),
        c.bitmask({
          shift: 32 + 20 + 20 + 4 + 5 + 4 + 32 + 12 + 10,
          mask: "0xffffffffffffffffffff",
          value: "0x" + parameters.avatar.slice(22, 42), // Last 10 bytes of the avatar address
        })
      )
    ),

    // WETH - Gnosis Bridge
    allowErc20Approve([WETH], [contracts.mainnet.gnosisBridge.gnoOmnibridge]),
    allow.mainnet.gnosisBridge.gnoOmnibridge[
      "relayTokens(address,address,uint256)"
    ](WETH, c.avatar),
    // Claim bridged WETH from Gnosis - Gnosis Bridge
    allow.mainnet.gnosisBridge.ambEthXdai.safeExecuteSignaturesWithAutoGasLimit(
      c.and(
        // messageId: 32 bytes
        // First 4 bytes
        c.bitmask({
          shift: 0,
          mask: "0xffffffff",
          value: "0x00050000",
        }),
        // Next 10 bytes
        c.bitmask({
          shift: 4,
          mask: "0xffffffffffffffffffff",
          value: "0xa7823d6f1e31569f5186",
        }),
        // Next 10 bytes
        c.bitmask({
          shift: 4 + 10,
          mask: "0xffffffffffffffffffff",
          value: "0x1e345b30c6bebf70ebe7",
        }),
        // skip last 8 bytes (nonce)
        // sender: 20 bytes
        c.bitmask({
          shift: 32,
          mask: "0xffffffffffffffffffff",
          value: contracts.gnosis.gnosisBridge.xdaiBridge.slice(0, 22), // First 10 bytes of the sender address (XDAI Bridge)
        }),
        c.bitmask({
          shift: 32 + 10,
          mask: "0xffffffffffffffffffff",
          value: "0x" + contracts.gnosis.gnosisBridge.xdaiBridge.slice(22, 42), // Second 10 bytes of the sender address (XDAI Bridge)
        }),
        // executor: 20 bytes
        c.bitmask({
          shift: 32 + 20,
          mask: "0xffffffffffffffffffff",
          value: contracts.mainnet.gnosisBridge.gnoOmnibridge.slice(0, 22), // First 10 bytes of the executor address (Omnibridge)
        }),
        c.bitmask({
          shift: 32 + 20 + 10,
          mask: "0xffffffffffffffffffff",
          value:
            "0x" + contracts.mainnet.gnosisBridge.gnoOmnibridge.slice(22, 42), // Second 10 bytes of the executor address (Omnibridge)
        }),
        // gasLimit: 4 bytes
        c.bitmask({
          shift: 32 + 20 + 20,
          mask: "0xffffffff",
          value: "0x000927c0",
        }),
        // dataType + chainIds: 5 bytes
        c.bitmask({
          shift: 32 + 20 + 20 + 4,
          mask: "0xffffffffff",
          value: "0x0101806401",
        }),
        // selector (handleNativeTokens): 4 bytes
        c.bitmask({
          shift: 32 + 20 + 20 + 4 + 5,
          mask: "0xffffffff",
          value: "0x272255bb",
        }),
        // skip the first 12 bytes (0's) of the address and scope the first 10 bytes
        // Token address
        c.bitmask({
          shift: 32 + 20 + 20 + 4 + 5 + 4 + 12,
          mask: "0xffffffffffffffffffff",
          value: WETH.slice(0, 22), // First 10 bytes of the token address
        }),
        c.bitmask({
          shift: 32 + 20 + 20 + 4 + 5 + 4 + 12 + 10,
          mask: "0xffffffffffffffffffff",
          value: "0x" + WETH.slice(22, 42), // Last 10 bytes of the token address
        }),
        // skip the first 12 bytes (0's) of the address and scope the first 10 bytes
        // Avatar address
        c.bitmask({
          shift: 32 + 20 + 20 + 4 + 5 + 4 + 32 + 12,
          mask: "0xffffffffffffffffffff",
          value: parameters.avatar.slice(0, 22), // First 10 bytes of the avatar address
        }),
        c.bitmask({
          shift: 32 + 20 + 20 + 4 + 5 + 4 + 32 + 12 + 10,
          mask: "0xffffffffffffffffffff",
          value: "0x" + parameters.avatar.slice(22, 42), // Last 10 bytes of the avatar address
        })
      )
    ),
  ] satisfies PermissionList
