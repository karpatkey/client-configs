import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import { eAddress, zeroAddress } from "@/addresses"
import {
  DAI,
  eETH,
  ETHx,
  GHO,
  GNO,
  liquidETH,
  liquidUSD,
  osETH,
  rsETH,
  SAFE,
  stETH,
  stUSR,
  sUSDe,
  USDC,
  USDe,
  USDS,
  USDT,
  USR,
  WBTC,
  weETH,
  WETH,
  wstETH,
  aaveV3,
} from "@/addresses/eth"
import { contracts } from "@/contracts"
import {
  allowErc20Approve,
  allowEthTransfer,
  allowErc20Transfer,
} from "@/helpers"
import { PermissionList } from "@/types"
import {
  gnosisDaoIaEth,
  gnosisDaoLpEth,
  gnosisDaoLmEth,
  gnosisDaoIaGno,
  gnosisDaoLmGno,
  gnosisDaoLpGno,
} from "../../../../../addresses"
import { Parameters } from "../../../../../parameters"

export default (parameters: Parameters) =>
  [
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

    // Balancer v3 - Aave Lido Boosted WETH/wstETH
    allowErc20Approve([WETH, wstETH], [contracts.mainnet.uniswap.permit2]),
    allow.mainnet.uniswap.permit2.approve(
      c.or(WETH, wstETH),
      contracts.mainnet.balancerV3.compositeLiquidityRouter
    ),
    allow.mainnet.balancerV3.compositeLiquidityRouter.addLiquidityProportionalToERC4626Pool(
      contracts.mainnet.balancerV3.aaveLidoWethWstEth
    ),
    allow.mainnet.balancerV3.compositeLiquidityRouter.addLiquidityUnbalancedToERC4626Pool(
      contracts.mainnet.balancerV3.aaveLidoWethWstEth
    ),
    allowErc20Approve(
      [contracts.mainnet.balancerV3.aaveLidoWethWstEth],
      [contracts.mainnet.balancerV3.compositeLiquidityRouter]
    ),
    allow.mainnet.balancerV3.compositeLiquidityRouter.removeLiquidityProportionalFromERC4626Pool(
      contracts.mainnet.balancerV3.aaveLidoWethWstEth
    ),
    allowErc20Approve(
      [contracts.mainnet.balancerV3.aaveLidoWethWstEth],
      [contracts.mainnet.balancerV3.aaveLidoWethWstEthGauge]
    ),
    allow.mainnet.balancerV3.aaveLidoWethWstEthGauge["deposit(uint256)"](),
    allow.mainnet.balancerV3.aaveLidoWethWstEthGauge["withdraw(uint256)"](),
    allow.mainnet.balancerV3.aaveLidoWethWstEthGauge["claim_rewards()"](),
    allow.mainnet.balancerV2.minter.mint(
      contracts.mainnet.balancerV3.aaveLidoWethWstEthGauge
    ),

    // Balancer v3 - Aave Boosted WETH/osETH
    allowErc20Approve([WETH, osETH], [contracts.mainnet.uniswap.permit2]),
    allow.mainnet.uniswap.permit2.approve(
      c.or(WETH, osETH),
      contracts.mainnet.balancerV3.compositeLiquidityRouter
    ),
    allow.mainnet.balancerV3.compositeLiquidityRouter.addLiquidityProportionalToERC4626Pool(
      contracts.mainnet.balancerV3.osEthWaWeth
    ),
    allow.mainnet.balancerV3.compositeLiquidityRouter.addLiquidityUnbalancedToERC4626Pool(
      contracts.mainnet.balancerV3.osEthWaWeth
    ),
    allowErc20Approve(
      [contracts.mainnet.balancerV3.osEthWaWeth],
      [contracts.mainnet.balancerV3.compositeLiquidityRouter]
    ),
    allow.mainnet.balancerV3.compositeLiquidityRouter.removeLiquidityProportionalFromERC4626Pool(
      contracts.mainnet.balancerV3.osEthWaWeth
    ),
    allowErc20Approve(
      [contracts.mainnet.balancerV3.osEthWaWeth],
      [contracts.mainnet.balancerV3.osEthWaWethGauge]
    ),
    allow.mainnet.balancerV3.osEthWaWethGauge["deposit(uint256)"](),
    allow.mainnet.balancerV3.osEthWaWethGauge["withdraw(uint256)"](),
    allow.mainnet.balancerV3.osEthWaWethGauge["claim_rewards()"](),
    allow.mainnet.balancerV2.minter.mint(
      contracts.mainnet.balancerV3.osEthWaWethGauge
    ),

    // Balancer v3 - Surge Fluid Boosted wstETH/WETH
    allowErc20Approve([WETH, wstETH], [contracts.mainnet.uniswap.permit2]),
    allow.mainnet.uniswap.permit2.approve(
      c.or(WETH, wstETH),
      contracts.mainnet.balancerV3.compositeLiquidityRouter
    ),
    allow.mainnet.balancerV3.compositeLiquidityRouter.addLiquidityProportionalToERC4626Pool(
      contracts.mainnet.balancerV3.surgeFluidWstEthWeth
    ),
    allow.mainnet.balancerV3.compositeLiquidityRouter.addLiquidityUnbalancedToERC4626Pool(
      contracts.mainnet.balancerV3.surgeFluidWstEthWeth
    ),
    allowErc20Approve(
      [contracts.mainnet.balancerV3.surgeFluidWstEthWeth],
      [contracts.mainnet.balancerV3.compositeLiquidityRouter]
    ),
    allow.mainnet.balancerV3.compositeLiquidityRouter.removeLiquidityProportionalFromERC4626Pool(
      contracts.mainnet.balancerV3.surgeFluidWstEthWeth
    ),
    allowErc20Approve(
      [contracts.mainnet.balancerV3.surgeFluidWstEthWeth],
      [contracts.mainnet.balancerV3.surgeFluidWstEthWethGauge]
    ),
    allow.mainnet.balancerV3.surgeFluidWstEthWethGauge["deposit(uint256)"](),
    allow.mainnet.balancerV3.surgeFluidWstEthWethGauge["withdraw(uint256)"](),
    allow.mainnet.balancerV3.surgeFluidWstEthWethGauge["claim_rewards()"](),
    allow.mainnet.balancerV2.minter.mint(
      contracts.mainnet.balancerV3.surgeFluidWstEthWethGauge
    ),

    // Enzyme - ETHx Hyperloop Vault
    // Deposit ETHx
    allowErc20Approve(
      [ETHx],
      [contracts.mainnet.enzyme.ethxHyperloopVaultComptrollerProxy]
    ),
    allow.mainnet.enzyme.ethxHyperloopVaultComptrollerProxy.buyShares(),
    // Withdraw ETHx
    allow.mainnet.enzyme.ethxHyperloopVaultComptrollerProxy.redeemSharesInKind(
      c.avatar,
      undefined,
      [],
      []
    ),

    // Ethena - Stake USDe
    allowErc20Approve([USDe], [sUSDe]),
    allow.mainnet.ethena.sUsde.deposit(undefined, c.avatar),
    // Ethena - Unstake USDe
    allow.mainnet.ethena.sUsde.cooldownShares(),
    allow.mainnet.ethena.sUsde.unstake(c.avatar),

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
    // ether.fi - Market-Neutral USD Vault - Deposit
    allowErc20Approve([DAI, USDC, USDT], [liquidUSD]),
    allow.mainnet.etherfi.marketNeutralUsdVaultTeller.deposit(
      c.or(DAI, USDC, USDT)
    ),
    // ether.fi - Market-Neutral USD Vault - Withdraw
    // https://help.ether.fi/en/articles/284654-how-to-withdraw-from-liquid-vaults
    allowErc20Approve([liquidUSD], [contracts.mainnet.etherfi.atomicQueue]),
    allow.mainnet.etherfi.atomicQueue.updateAtomicRequest(
      liquidUSD,
      c.or(DAI, USDC, USDT)
    ),

    // Kelp - Stake/Unstake ETH, ETHx and stETH
    allow.mainnet.kelp.lrtDepositPool.depositETH(undefined, undefined, {
      send: true,
    }),
    allowErc20Approve([ETHx, stETH], [contracts.mainnet.kelp.lrtDepositPool]),
    allow.mainnet.kelp.lrtDepositPool.depositAsset(c.or(ETHx, stETH)),
    allowErc20Approve([rsETH], [contracts.mainnet.kelp.lrtDepositPool]),
    allow.mainnet.kelp.lrtWithdrawalManager.initiateWithdrawal(
      c.or(eAddress, ETHx, stETH)
    ),
    allow.mainnet.kelp.lrtWithdrawalManager.completeWithdrawal(
      c.or(eAddress, ETHx, stETH)
    ),

    // Merkl - ACI Merit Rewards
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

    // Origin - Mint OETH via Vault
    allow.mainnet.origin.oEthZapper.deposit({ send: true }),
    // Origin - Redeem via OETH Vault
    // OETH is burnt by the user so no approval is needed
    allow.mainnet.origin.oEthVault.requestWithdrawal(),
    allow.mainnet.origin.oEthVault.claimWithdrawal(),
    allow.mainnet.origin.oEthVault.claimWithdrawals(),
    // Opt into yield
    allow.mainnet.origin.oEth.rebaseOptIn(),

    // Resolv - USR Staking/Unstaking
    allowErc20Approve([USR], [contracts.mainnet.resolv.wstUsr]),
    allow.mainnet.resolv.wstUsr["deposit(uint256)"](),
    allowErc20Approve([stUSR], [contracts.mainnet.resolv.wstUsr]),
    allow.mainnet.resolv.wstUsr["redeem(uint256)"](),

    // Uniswap v3 - ETHx + wstETH
    allow.mainnet.uniswapV3.positionsNft.createAndInitializePoolIfNecessary(
      c.or(ETHx, wstETH),
      c.or(ETHx, wstETH)
    ),
    // Uniswap v3 - rsETH + wstETH
    allow.mainnet.uniswapV3.positionsNft.createAndInitializePoolIfNecessary(
      c.or(rsETH, wstETH),
      c.or(rsETH, wstETH)
    ),

    /*********************************************
     * Bridge
     *********************************************/
    // DAI -> XDAI - Gnosis Bridge
    allowErc20Approve([DAI], [contracts.mainnet.gnosisBridge.xdaiUsdsBridge]),
    // Destinations: gnosisDaoIaGno, gnosisDaoLmGno and gnosisDaoLpGno
    allow.mainnet.gnosisBridge.xdaiUsdsBridge.relayTokens(
      DAI,
      c.or(gnosisDaoIaGno, gnosisDaoLmGno, gnosisDaoLpGno)
    ),
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
    ](gnosisDaoIaGno, { send: true }),

    // GHO - Chainlink - transporter.io
    allowErc20Approve([GHO], [contracts.mainnet.chainlink.router]),
    allow.mainnet.chainlink.router.ccipSend(
      "465200170687744372", // https://docs.chain.link/ccip/directory/mainnet/chain/xdai-mainnet
      {
        receiver: c.or(
          "0x" + gnosisDaoLmGno.slice(2).padStart(64, "0"),
          "0x" + gnosisDaoLpGno.slice(2).padStart(64, "0")
        ),
        data: "0x",
        // https://docs.chain.link/ccip/api-reference/evm/v1.6.1/client#evmtokenamount
        tokenAmounts: c.matches([
          {
            token: GHO,
            amount: undefined,
          },
        ]),
        feeToken: zeroAddress,
        // https://docs.chain.link/ccip/api-reference/evm/v1.6.1/client#generic_extra_args_v2_tag
        // https://docs.chain.link/ccip/api-reference/evm/v1.6.1/client#genericextraargsv2
        extraArgs:
          "0x181dcf1000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001",
      },
      {
        send: true,
      }
    ),

    // GNO - Gnosis Bridge
    allowErc20Approve([GNO], [contracts.mainnet.gnosisBridge.gnoOmnibridge]),
    allow.mainnet.gnosisBridge.gnoOmnibridge[
      "relayTokens(address,address,uint256)"
    ](GNO, gnosisDaoIaGno),
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
    ](SAFE, gnosisDaoIaGno),
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
    // Destinations: gnosisDaoIaGno, gnosisDaoLmGno, gnosisDaoLpGno
    allow.mainnet.gnosisBridge.gnoOmnibridge.relayTokensAndCall(
      USDC,
      contracts.gnosis.gnosisBridge.usdcTransmuter,
      undefined,
      c.or(
        "0x" + gnosisDaoIaGno.slice(2).padStart(64, "0"),
        "0x" + gnosisDaoLmGno.slice(2).padStart(64, "0"),
        "0x" + gnosisDaoLpGno.slice(2).padStart(64, "0")
      )
    ),
    // Claim bridged USDC from Gnosis
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

    // USDT - Gnosis Bridge
    allowErc20Approve([USDT], [contracts.mainnet.gnosisBridge.gnoOmnibridge]),
    allow.mainnet.gnosisBridge.gnoOmnibridge[
      "relayTokens(address,address,uint256)"
    ](USDT, gnosisDaoIaGno),
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
    ](WBTC, gnosisDaoIaGno),
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
    // Destinations: gnosisDaoIaGno, gnosisDaoLmGno, gnosisDaoLpGno
    allow.mainnet.gnosisBridge.gnoOmnibridge[
      "relayTokens(address,address,uint256)"
    ](WETH, c.or(gnosisDaoIaGno, gnosisDaoLmGno, gnosisDaoLpGno)),
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

    // wstETH - Gnosis Bridge
    allowErc20Approve([wstETH], [contracts.mainnet.gnosisBridge.gnoOmnibridge]),
    // Destinations: gnosisDaoIaGno, gnosisDaoLmGno and gnosisDaoLpGno
    allow.mainnet.gnosisBridge.gnoOmnibridge[
      "relayTokens(address,address,uint256)"
    ](wstETH, c.or(gnosisDaoIaGno, gnosisDaoLmGno, gnosisDaoLpGno)),
    // Claim bridged wstETH from Gnosis - Gnosis Bridge
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
          value: wstETH.slice(0, 22), // First 10 bytes of the token address
        }),
        c.bitmask({
          shift: 32 + 20 + 20 + 4 + 5 + 4 + 12 + 10,
          mask: "0xffffffffffffffffffff",
          value: "0x" + wstETH.slice(22, 42), // Last 10 bytes of the token address
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
    // Transfer ETH between Gnosis DAO Safes
    allowEthTransfer(gnosisDaoIaEth),
    allowEthTransfer(gnosisDaoLpEth),
    allowEthTransfer(gnosisDaoLmEth),

    // Transfer [DAI, stETH, USDC, USDS, USDT, WETH, wstETH] between Gnosis DAO Safes
    allowErc20Transfer(
      [DAI, stETH, USDC, USDS, USDT, WETH, wstETH],
      [gnosisDaoIaEth, gnosisDaoLpEth, gnosisDaoLmEth]
    ),
  ] satisfies PermissionList
