import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import {
  AAVE,
  BAL,
  COMP,
  DAI,
  GHO,
  GNO,
  GYD,
  OETH,
  rETH,
  sDAI,
  stETH,
  stkAAVE,
  sUSDe,
  SWISE,
  USDC,
  USDe,
  USDS,
  USDT,
  WBTC,
  WETH,
  wstETH,
  aaveV3,
  balancerV2,
  gearbox,
  pendle,
  siloV2,
} from "@/addresses/eth"
import { eAddress, zeroAddress } from "@/addresses"
import { contracts } from "@/contracts"
import { allowErc20Approve, allowErc20Transfer } from "@/helpers"
import { PermissionList } from "@/types"
import { balancerV2Swap } from "@/exit_strategies/balancerV2"
import { Parameters } from "../../../parameters"
import { kpkEth } from "../../../addresses"

export default (parameters: Parameters) =>
  [
    // Wrapping and unwrapping of ETH, WETH
    allow.mainnet.weth.withdraw(),
    allow.mainnet.weth.deposit({
      send: true,
    }),

    // Aave Umbrella Staking - GHO
    allowErc20Approve([GHO], [contracts.mainnet.aaveV3.umbrellaBatchHelper]),
    allow.mainnet.aaveV3.umbrellaBatchHelper.deposit({
      stakeToken: aaveV3.stkEthGHO,
      edgeToken: GHO,
    }),
    allowErc20Approve([GHO], [aaveV3.stkEthGHO]),
    {
      ...allow.mainnet.aaveV3.stkwaEthToken.deposit(undefined, c.avatar),
      targetAddress: aaveV3.stkEthGHO,
    },
    {
      ...allow.mainnet.aaveV3.stkwaEthToken.cooldown(),
      targetAddress: aaveV3.stkEthGHO,
    },
    allow.mainnet.aaveV3.umbrellaBatchHelper.redeem({
      stakeToken: aaveV3.stkEthGHO,
      edgeToken: GHO,
    }),
    {
      ...allow.mainnet.aaveV3.stkwaEthToken.redeem(
        undefined,
        c.avatar,
        c.avatar
      ),
      targetAddress: aaveV3.stkEthGHO,
    },

    // Aave Umbrella Staking - USDC
    allowErc20Approve([USDC], [contracts.mainnet.aaveV3.umbrellaBatchHelper]),
    allow.mainnet.aaveV3.umbrellaBatchHelper.deposit({
      stakeToken: aaveV3.stkEthUSDC,
      edgeToken: USDC,
    }),
    allowErc20Approve([USDC], [aaveV3.stkEthUSDC]),
    {
      ...allow.mainnet.aaveV3.stkwaEthToken.deposit(undefined, c.avatar),
      targetAddress: aaveV3.stkEthUSDC,
    },
    {
      ...allow.mainnet.aaveV3.stkwaEthToken.cooldown(),
      targetAddress: aaveV3.stkEthUSDC,
    },
    allow.mainnet.aaveV3.umbrellaBatchHelper.redeem({
      stakeToken: aaveV3.stkEthUSDC,
      edgeToken: USDC,
    }),
    {
      ...allow.mainnet.aaveV3.stkwaEthToken.redeem(
        undefined,
        c.avatar,
        c.avatar
      ),
      targetAddress: aaveV3.stkEthUSDC,
    },

    // Aave Umbrella Staking - USDT
    allowErc20Approve([USDT], [contracts.mainnet.aaveV3.umbrellaBatchHelper]),
    allow.mainnet.aaveV3.umbrellaBatchHelper.deposit({
      stakeToken: aaveV3.stkEthUSDT,
      edgeToken: USDT,
    }),
    allowErc20Approve([USDT], [aaveV3.stkEthUSDT]),
    {
      ...allow.mainnet.aaveV3.stkwaEthToken.deposit(undefined, c.avatar),
      targetAddress: aaveV3.stkEthUSDT,
    },
    {
      ...allow.mainnet.aaveV3.stkwaEthToken.cooldown(),
      targetAddress: aaveV3.stkEthUSDT,
    },
    allow.mainnet.aaveV3.umbrellaBatchHelper.redeem({
      stakeToken: aaveV3.stkEthUSDT,
      edgeToken: USDT,
    }),
    {
      ...allow.mainnet.aaveV3.stkwaEthToken.redeem(
        undefined,
        c.avatar,
        c.avatar
      ),
      targetAddress: aaveV3.stkEthUSDT,
    },

    // Aave Umbrella Staking - WETH
    allowErc20Approve([WETH], [contracts.mainnet.aaveV3.umbrellaBatchHelper]),
    allow.mainnet.aaveV3.umbrellaBatchHelper.deposit({
      stakeToken: aaveV3.stkEthWETH,
      edgeToken: WETH,
    }),
    allowErc20Approve([WETH], [aaveV3.stkEthWETH]),
    {
      ...allow.mainnet.aaveV3.stkwaEthToken.deposit(undefined, c.avatar),
      targetAddress: aaveV3.stkEthWETH,
    },
    {
      ...allow.mainnet.aaveV3.stkwaEthToken.cooldown(),
      targetAddress: aaveV3.stkEthWETH,
    },
    allow.mainnet.aaveV3.umbrellaBatchHelper.redeem({
      stakeToken: aaveV3.stkEthWETH,
      edgeToken: WETH,
    }),
    {
      ...allow.mainnet.aaveV3.stkwaEthToken.redeem(
        undefined,
        c.avatar,
        c.avatar
      ),
      targetAddress: aaveV3.stkEthWETH,
    },

    // Claim Umbrella Staking Rewards
    allow.mainnet.aaveV3.umbrellaRewardsController[
      "claimSelectedRewards(address,address[],address)"
    ](undefined, undefined, c.avatar),

    // Balancer v2 - BCoW-50WETH-50USDC - Withdraw
    allow.mainnet.balancerV2.bCow50Weth50Usdc.exitPool(),

    // Balancer v2 - BCoW-50BAL-50ETH - Withdraw
    allow.mainnet.balancerV2.bCow50Bal50Eth.exitPool(),

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

    // Curve - Deposit and Stake using a special ZAP
    allowErc20Approve([OETH], [contracts.mainnet.curve.stakeDepositZap]),
    allow.mainnet.curve.stakeDepositZap[
      "deposit_and_stake(address,address,address,uint256,address[],uint256[],uint256,bool,bool,address)"
    ](
      contracts.mainnet.curve.oEthCrvPool,
      contracts.mainnet.curve.oEthCrvPool,
      contracts.mainnet.curve.oEthCrvGauge,
      2,
      [eAddress, OETH],
      undefined,
      undefined,
      undefined,
      undefined,
      zeroAddress,
      { send: true }
    ),

    // Ethena - Stake USDe
    allowErc20Approve([USDe], [sUSDe]),
    allow.mainnet.ethena.sUsde.deposit(undefined, c.avatar),
    // Ethena - Unstake USDe
    allow.mainnet.ethena.sUsde.cooldownShares(),
    allow.mainnet.ethena.sUsde.unstake(c.avatar),

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

    // Sablier - Withdraw FJO
    allow.mainnet.sablier.v2LockUpDyn.withdraw(undefined, c.avatar),

    // Silo v2 - Withdraw BAL
    allow.mainnet.siloV2.router.execute(
      c.matches([
        {
          actionType: 1, // Withdraw - https://etherscan.io/address/0x8658047e48cc09161f4152c79155dac1d710ff0a#code#F1#L27
          silo: siloV2.balSilo,
          asset: BAL,
        },
      ])
    ),

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

    /*********************************************
     * SWAPS
     *********************************************/
    // Balancer - COMP -> WETH
    balancerV2Swap(balancerV2.b50Comp50WethPid, [COMP], [WETH]),

    // Balancer - WETH -> DAI
    balancerV2Swap(balancerV2.b60Weth40DaiPid, [WETH], [DAI]),

    // Balancer - WETH -> USDC
    balancerV2Swap(balancerV2.b50Usdc50WethPid, [WETH], [USDC]),

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

    // Balancer - GYD <-> USDT
    balancerV2Swap(balancerV2.eclpGydUsdtPid, [GYD, USDT], [GYD, USDT]),

    // Balancer - GYD <-> sDAI
    balancerV2Swap(balancerV2.eclpGydSdaiPid, [GYD, sDAI], [GYD, sDAI]),

    // Balancer - GYD <-> sDAI
    balancerV2Swap(balancerV2.eclpGydSdai2Pid, [GYD, sDAI], [GYD, sDAI]),

    // Balancer - GYD <-> USDC
    balancerV2Swap(balancerV2.eclpGydUsdcPid, [GYD, USDC], [GYD, USDC]),

    // Balancer - GHO <-> GYD
    balancerV2Swap(balancerV2.eclpGhoGydPid, [GHO, GYD], [GHO, GYD]),

    // Balancer - GHO <-> [USDC, USDT]
    balancerV2Swap(balancerV2.ghoUsdtUsdcPid, [GHO], [USDC, USDT]),
    balancerV2Swap(balancerV2.ghoUsdtUsdcPid, [USDC, USDT], [GHO]),

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

    // Pendle - USDe <-> PT-USDE-DDMMMYYYY
    allowErc20Approve([USDe], [contracts.mainnet.pendle.routerV4]),
    allow.mainnet.pendle.routerV4.swapExactTokenForPt(
    c.avatar,
    pendle.ptUsde05Feb2026,
    undefined,
    undefined,
    {
      tokenIn: USDe,
      tokenMintSy: USDe,
      pendleSwap: zeroAddress,
      swapData: {
        swapType: 0, // NONE: https://etherscan.io/address/0xd8d200d9a713a1c71cf1e7f694b14e5f1d948b15#code#F32#L18
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
  allowErc20Approve([pendle.ptUsde05Feb2026], [contracts.mainnet.pendle.routerV4]),
  allow.mainnet.pendle.routerV4.swapExactPtForToken(
    c.avatar,
    pendle.ptUsde05Feb2026,
    undefined,
    {
      tokenOut: USDe,
      tokenRedeemSy: USDe,
      pendleSwap: zeroAddress,
      swapData: {
        swapType: 0, // NONE: https://etherscan.io/address/0xd8d200d9a713a1c71cf1e7f694b14e5f1d948b15#code#F32#L18
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

    // Uniswap v3 - [AAVE, COMP, DAI, rETH, stETH, stkAAVE, SWISE, USDC, USDT, WBTC, WETH, wstETH] ->
    // [DAI, rETH, stETH, USDC, USDT, WBTC, WETH, wstETH]
    allowErc20Approve(
      [
        AAVE,
        COMP,
        DAI,
        rETH,
        stETH,
        stkAAVE,
        SWISE,
        USDC,
        USDT,
        WBTC,
        WETH,
        wstETH,
      ],
      [contracts.mainnet.uniswapV3.router2]
    ),
    allow.mainnet.uniswapV3.router2.exactInputSingle({
      tokenIn: c.or(
        AAVE,
        COMP,
        DAI,
        rETH,
        stETH,
        stkAAVE,
        SWISE,
        USDC,
        USDT,
        WBTC,
        WETH,
        wstETH
      ),
      tokenOut: c.or(DAI, rETH, stETH, USDC, USDT, WBTC, WETH, wstETH),
      recipient: c.avatar,
    }),

    /*********************************************
     * Bridge
     *********************************************/
    // Mainnet -> Gnosis
    // DAI -> XDAI - Gnosis Bridge
    allowErc20Approve([DAI], [contracts.mainnet.gnosisBridge.xdaiUsdsBridge]),
    allow.mainnet.gnosisBridge.xdaiUsdsBridge.relayTokens(DAI, c.avatar),
    // Claim bridged XDAI from Gnosis (DAI or USDS)
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
            "0x" + contracts.mainnet.gnosisBridge.gnoXdaiBridge.slice(22, 42), // Last 10 bytes of xDai Bridge
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

    // USDS -> XDAI - Gnosis Bridge
    allowErc20Approve([USDS], [contracts.mainnet.gnosisBridge.xdaiUsdsBridge]),
    allow.mainnet.gnosisBridge.xdaiUsdsBridge.relayTokens(USDS, c.avatar),
    // Claiming already considered with: Claim bridged XDAI from Gnosis (DAI or USDS)

    // USDT - Gnosis Bridge
    allowErc20Approve([USDT], [contracts.mainnet.gnosisBridge.gnoOmnibridge]),
    allow.mainnet.gnosisBridge.gnoOmnibridge[
      "relayTokens(address,address,uint256)"
    ](USDT, c.avatar),
    // Claim bridged USDT from Gnosis - Gnosis Bridge
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
          value: USDT.slice(0, 22), // First 10 bytes of the token address
        }),
        c.bitmask({
          shift: 32 + 20 + 20 + 4 + 5 + 4 + 12 + 10,
          mask: "0xffffffffffffffffffff",
          value: "0x" + USDT.slice(22, 42), // Last 10 bytes of the token address
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

    // WBTC - Gnosis Bridge
    allowErc20Approve([WBTC], [contracts.mainnet.gnosisBridge.gnoOmnibridge]),
    allow.mainnet.gnosisBridge.gnoOmnibridge[
      "relayTokens(address,address,uint256)"
    ](WBTC, c.avatar),
    // Claim bridged WBTC from Gnosis
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
          value: WBTC.slice(0, 22), // First 10 bytes of the token address
        }),
        c.bitmask({
          shift: 32 + 20 + 20 + 4 + 5 + 4 + 12 + 10,
          mask: "0xffffffffffffffffffff",
          value: "0x" + WBTC.slice(22, 42), // Last 10 bytes of the token address
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

    /*********************************************
     * Transfers
     *********************************************/
    // Transfer up to 100k USDC every quarter (90 days) to kpk Treasury
    allowErc20Transfer([USDC], [kpkEth], "USDC_KPK-FEES"),
  ] satisfies PermissionList
