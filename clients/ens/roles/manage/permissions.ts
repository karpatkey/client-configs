import { c, Permission } from "zodiac-roles-sdk";
import { allow } from "zodiac-roles-sdk/kit";
import { allow as allowAction } from "defi-kit/eth";
import {
  DAI,
  USDC,
  rETH2,
  sETH2,
  stETH,
  SWISE,
  WETH,
  E_ADDRESS,
  ZERO_ADDRESS,
} from "../../../../eth-sdk/addresses";
import { contracts } from "../../../../eth-sdk/config";
import { allowErc20Approve } from "../../../../utils/erc20";
import { avatar } from "../../index";

const ACTION_SUPPLY_NATIVE_TOKEN =
  "0x414354494f4e5f535550504c595f4e41544956455f544f4b454e000000000000";
const ACTION_WITHDRAW_NATIVE_TOKEN =
  "0x414354494f4e5f57495448445241575f4e41544956455f544f4b454e00000000";
const ACTION_CLAIM_REWARD =
  "0x414354494f4e5f434c41494d5f52455741524400000000000000000000000000";

export default [
  // Use defi-kit to generate the permissions...
  // Lido
  ...allowAction.lido.deposit(),

  // Compound v3 - cUSDCv3 - USDC
  ...allowAction.compound_v3.deposit({
    targets: ["cUSDCv3"],
    tokens: ["USDC"],
  }),
  // Compound v3 - cUSDCv3 - USDC
  ...allowAction.compound_v3.deposit({ targets: ["cWETHv3"], tokens: ["ETH"] }),

  // AURA wstETH/WETH
  ...allowAction.aura.deposit({ targets: ["153"] }),
  // Aura rETH/WETH
  ...allowAction.aura.deposit({ targets: ["109"] }),

  // ... or address the contracts eth-sdk/config.ts via the zodiac-roles-sdk/kit
  // Compound v2 - USDC
  ...allowErc20Approve([USDC], [contracts.mainnet.compound_v2.cUSDC]),
  allow.mainnet.compound_v2.cUSDC.mint(),
  // Withdraw: it is called when MAX underlying amount is withdrawn
  allow.mainnet.compound_v2.cUSDC.redeem(),
  // Withdraw: it is called when MAX underlying amount is NOT withdrawn
  allow.mainnet.compound_v2.cUSDC.redeemUnderlying(),

  // Compound v2 - DAI
  ...allowErc20Approve([DAI], [contracts.mainnet.compound_v2.cUSDC]),
  allow.mainnet.compound_v2.cDAI.mint(),
  // Withdraw: it is called when MAX underlying amount is withdrawn
  allow.mainnet.compound_v2.cDAI.redeem(),
  // Withdraw: it is called when MAX underlying amount is NOT withdrawn
  allow.mainnet.compound_v2.cDAI.redeemUnderlying(),

  // Compound v2 - Claim COMP
  allow.mainnet.compound_v2.comptroller["claimComp(address,address[])"](
    avatar,
    c.subset([
      contracts.mainnet.compound_v2.cDAI,
      contracts.mainnet.compound_v2.cUSDC,
    ]), // ASK Jan?? subset is ok or should I use c.every(c.or))
  ),

  // // Compound v3 - USDC
  // ...allowErc20Approve([USDC], [contracts.mainnet.compound_v3.cUSDCv3]),
  // allow.mainnet.compound_v3.cUSDCv3.supply(USDC),
  // allow.mainnet.compound_v3.cUSDCv3.withdraw(USDC),

  // // Compound v3 - ETH
  // // IMPORTANT: the Comet implementation does not have the allow function, but if you take a look to the fallback() function
  // // https://etherscan.io/address/0x7a1316220a46dce22fd5c6d55a39513367e6c967#code#F1#L1314
  // // function extensionDelegate() virtual external view returns (address) -> Read function
  // // The extensionDelegate() function retrieves the CometExt address = 0xe2C1F54aFF6b38fD9DF7a69F22cB5fd3ba09F030
  // // which has the allow() function in it. Or using the cUSDCv3 Ext (0x285617313887d43256F852cAE0Ee4de4b68D45B0) abi
  // allow.mainnet.compound_v3.cWETHv3.allow(contracts.mainnet.compound_v3.MainnetBulker),
  // allow.mainnet.compound_v3.MainnetBulker.invoke(
  //   [ACTION_SUPPLY_NATIVE_TOKEN], // Ask Jan?? can I use c.some(ACTION_SUPPLY_NATIVE_TOKEN and ACTION_WITHDRAW_NATIVE_TOKEN)
  //   c.matches([
  //     c.abiEncodedMatches(
  //       [contracts.mainnet.compound_v3.cWETHv3, avatar],
  //       ["address", "address", "uint256"]
  //     ),
  //   ]),
  //   { send: true }
  // ),
  // allow.mainnet.compound_v3.MainnetBulker.invoke(
  //   [ACTION_WITHDRAW_NATIVE_TOKEN],
  //   c.matches([
  //     c.abiEncodedMatches(
  //       [contracts.mainnet.compound_v3.cWETHv3, avatar],
  //       ["address", "address", "uint256"]
  //     ),
  //   ]),
  //   // Roles mod does not support scoping the same function with different option values.
  //   // So we must also allow send here. This is not a problem because the MainnetBulker contract
  //   // will refund any sent but unused ETH.
  //   { send: true }
  // ),
  // // ALL IN ONE USING MAINNET BULKER (Ask Jan?? If it's OK)
  // // allow.mainnet.compound_v3.MainnetBulker.invoke(
  // //   c.every(
  // //     c.or(
  // //       c.eq(ACTION_SUPPLY_NATIVE_TOKEN),
  // //       c.eq(ACTION_WITHDRAW_NATIVE_TOKEN),
  // //       c.eq(ACTION_CLAIM_REWARD)
  // //     )
  // //   ),
  // //   c.every(
  // //     c.or(
  // //       c.matches([
  // //         c.abiEncodedMatches(
  // //           [contracts.mainnet.compound_v3.cWETHv3, avatar],
  // //           ["address", "address", "uint256"]
  // //         ),
  // //       ]),
  // //       c.matches([
  // //         c.abiEncodedMatches(
  // //           [
  // //             contracts.mainnet.compound_v3.cWETHv3,
  // //             contracts.mainnet.compound_v3.CometRewards,
  // //             c.avatar,
  // //           ],
  // //           ["address", "address", "address", "bool"]
  // //         ),
  // //       ])
  // //     )
  // //   ),
  // //   { send: true }
  // // )

  // // Compound v3 - Claim COMP
  // allow.mainnet.compound_v3.CometRewards.claim(
  //   c.or(
  //     c.eq(contracts.mainnet.compound_v3.cUSDCv3),
  //     c.eq(contracts.mainnet.compound_v3.cWETHv3)
  //   ),
  //   c.avatar
  // )

  // Aave v3 - DAI
  ...allowErc20Approve([DAI], [contracts.mainnet.aave_v3.pool_v3]),
  allow.mainnet.aave_v3.pool_v3.supply(DAI, undefined, avatar),
  allow.mainnet.aave_v3.pool_v3.withdraw(DAI, undefined, avatar),

  // Aave v3 - USDC
  ...allowErc20Approve([USDC], [contracts.mainnet.aave_v3.pool_v3]),
  allow.mainnet.aave_v3.pool_v3.supply(USDC, undefined, avatar),
  allow.mainnet.aave_v3.pool_v3.withdraw(USDC, undefined, avatar),

  // Aave v3 - ETH
  allow.mainnet.aave_v3.wrapped_token_gateway_v3.depositETH(
    contracts.mainnet.aave_v3.pool_v3,
    avatar,
    undefined,
    { send: true },
  ),
  allow.mainnet.aave_v3.wrapped_token_gateway_v3.withdrawETH(
    contracts.mainnet.aave_v3.pool_v3,
    avatar,
    undefined,
  ),

  // Aave v3 - WETH
  ...allowErc20Approve([WETH], [contracts.mainnet.aave_v3.pool_v3]),
  allow.mainnet.aave_v3.pool_v3.supply(USDC, undefined, avatar),
  allow.mainnet.aave_v3.pool_v3.withdraw(USDC, undefined, avatar),

  // Stakewise
  // The stake() was added manually to the abi (source: 0x61975c09207c5DFe794b0A652C8CAf8458159AAe)
  allow.mainnet.stakewise.eth2_staking.stake({
    send: true,
  }),
  allow.mainnet.stakewise.merkle_distributor["claim"](undefined, avatar, [
    rETH2,
    SWISE,
  ]), // Ask Jan? Can be improved using c.subset()

  // Stakewise - UniswapV3 ETH + sETH2, 0.3%
  ...allowErc20Approve(
    [sETH2, WETH],
    [contracts.mainnet.uniswapv3.positions_nft],
  ),
  // Add liquidity using WETH
  allow.mainnet.uniswapv3.positions_nft.mint(
    {
      token0: WETH,
      token1: sETH2,
      fee: 3000,
      recipient: avatar
    }
  ),
  // Add liquidity using ETH
  allow.mainnet.uniswapv3.positions_nft.multicall(
    c.every(
      c.and(
        c.calldataMatches(
          allow.mainnet.uniswapv3.positions_nft.increaseLiquidity(
            {
              tokenId: 424810
            }
          ),
        ),
        c.calldataMatches(allow.mainnet.uniswapv3.positions_nft.refundETH()),
      ),
    ),
    { send: true },
  ),
  // Remove liquidity using WETH
  allow.mainnet.uniswapv3.positions_nft.multicall(
    c.every(
      c.and(
        c.calldataMatches(
          allow.mainnet.uniswapv3.positions_nft.decreaseLiquidity(
            {
              tokenId: 424810
            }
          ),
        ),
        c.calldataMatches(
          allow.mainnet.uniswapv3.positions_nft.collect(
            {
              recipient: avatar
            }
          ),
        ),
      ),
    ),
    { send: true }, // Ask Jan??
  ),
  // Remove liquidity using ETH
  allow.mainnet.uniswapv3.positions_nft.multicall(
    c.every(
      c.and(
        c.calldataMatches(
          allow.mainnet.uniswapv3.positions_nft.decreaseLiquidity(),
        ),
        c.calldataMatches(
          allow.mainnet.uniswapv3.positions_nft.collect(
            {
              tokenId: ZERO_ADDRESS
            }
          ),
        ),
        c.calldataMatches(
          allow.mainnet.uniswapv3.positions_nft.unwrapWETH9(undefined, avatar),
        ),
        c.calldataMatches(
          allow.mainnet.uniswapv3.positions_nft.sweepToken(
            sETH2,
            undefined,
            avatar,
          ),
        ),
      ),
    ),
    { send: true }, // Ask Jan??
  ),
  // Collect fees using WETH
  allow.mainnet.uniswapv3.positions_nft.collect(
    {
      recipient: avatar
    }
  ),
  // Collect fees using ETH
  allow.mainnet.uniswapv3.positions_nft.multicall(
    c.every(
      c.and(
        c.calldataMatches(
          allow.mainnet.uniswapv3.positions_nft.collect(
            {
              recipient: ZERO_ADDRESS
            }
          ),
        ),
        c.calldataMatches(
          allow.mainnet.uniswapv3.positions_nft.unwrapWETH9(undefined, avatar),
        ),
        c.calldataMatches(
          allow.mainnet.uniswapv3.positions_nft.sweepToken(
            sETH2,
            undefined,
            avatar,
          ),
        ),
      ),
    ),
    { send: true }, // Ask Jan??
  ),

  // Curve - ETH/stETH
  ...allowErc20Approve([stETH], [contracts.mainnet.curve.steth_eth_pool]),
  allow.mainnet.curve.steth_eth_pool.add_liquidity(undefined, undefined, {
    send: true,
  }),
  allow.mainnet.curve.steth_eth_pool.remove_liquidity(),
  allow.mainnet.curve.steth_eth_pool.remove_liquidity_one_coin(),
  allow.mainnet.curve.steth_eth_pool.remove_liquidity_imbalance(),
  ...allowErc20Approve(
    [contracts.mainnet.curve.steCRV],
    [contracts.mainnet.curve.steth_eth_gauge],
  ),
  allow.mainnet.curve.steth_eth_gauge["deposit(uint256)"](),
  allow.mainnet.curve.steth_eth_gauge.withdraw(),
  allow.mainnet.curve.steth_eth_gauge["claim_rewards()"](),
  allow.mainnet.curve.crv_minter.mint(contracts.mainnet.curve.steth_eth_gauge),
  // Deposit and Stake using a special ZAP
  allow.mainnet.curve.steth_eth_gauge.set_approve_deposit(
    contracts.mainnet.curve.stake_deposit_zap,
  ),

  // Curve - cDAI/cUSDC
  ...allowErc20Approve(
    [
      DAI,
      USDC,
      contracts.mainnet.compound_v2.cDAI,
      contracts.mainnet.compound_v2.cUSDC,
    ],
    [contracts.mainnet.curve.cDAIcUSDC_pool],
  ),
  ...allowErc20Approve([DAI, USDC], [contracts.mainnet.curve.cDAIcUSDC_zap]),
  allow.mainnet.curve.cDAIcUSDC_pool.add_liquidity(),
  allow.mainnet.curve.cDAIcUSDC_zap.add_liquidity(),
  allow.mainnet.curve.cDAIcUSDC_pool.remove_liquidity(),
  allow.mainnet.curve.cDAIcUSDC_zap.remove_liquidity(),
  allow.mainnet.curve.cDAIcUSDC_pool.remove_liquidity_imbalance(),
  allow.mainnet.curve.cDAIcUSDC_zap.remove_liquidity_imbalance(),
  allow.mainnet.curve.cDAIcUSDC_zap[
    "remove_liquidity_one_coin(uint256,int128,uint256)"
  ](),
  allow.mainnet.curve.cDAIcUSDC_pool.exchange(),
  allow.mainnet.curve.cDAIcUSDC_pool.exchange_underlying(),
  ...allowErc20Approve(
    [contracts.mainnet.curve.crvcDAIcUSDC],
    [contracts.mainnet.curve.cDAIcUSDC_gauge],
  ),
  allow.mainnet.curve.cDAIcUSDC_gauge["deposit(uint256)"](),
  allow.mainnet.curve.cDAIcUSDC_gauge.withdraw(),
  allow.mainnet.curve.crv_minter.mint(contracts.mainnet.curve.cDAIcUSDC_gauge),
  // Deposit and Stake using a special ZAP
  allow.mainnet.curve.cDAIcUSDC_gauge.set_approve_deposit(
    contracts.mainnet.curve.stake_deposit_zap,
  ),

  // Curve - Deposit and Stake using a special ZAP
  ...allowErc20Approve([stETH], [contracts.mainnet.curve.stake_deposit_zap]),
  ...allowErc20Approve(
    [
      contracts.mainnet.compound_v2.cDAI,
      contracts.mainnet.compound_v2.cUSDC,
      DAI,
      USDC,
    ],
    [contracts.mainnet.curve.stake_deposit_zap],
  ),
  allow.mainnet.curve.stake_deposit_zap[
    "deposit_and_stake(address,address,address,uint256,address[5],uint256[5],uint256,bool,address)"
  ](
    c.or(
      contracts.mainnet.curve.steth_eth_pool,
      contracts.mainnet.curve.cDAIcUSDC_pool,
      contracts.mainnet.curve.cDAIcUSDC_zap,
    ),
    c.or(contracts.mainnet.curve.steCRV, contracts.mainnet.curve.crvcDAIcUSDC),
    c.or(
      contracts.mainnet.curve.steth_eth_gauge,
      contracts.mainnet.curve.cDAIcUSDC_gauge,
    ),
    2,
    c.or(
      [E_ADDRESS, stETH, ZERO_ADDRESS, ZERO_ADDRESS, ZERO_ADDRESS],
      [DAI, USDC, ZERO_ADDRESS, ZERO_ADDRESS, ZERO_ADDRESS],
      [
        contracts.mainnet.compound_v2.cUSDC,
        contracts.mainnet.compound_v2.cDAI,
        ZERO_ADDRESS,
        ZERO_ADDRESS,
        ZERO_ADDRESS,
      ],
    ),
    undefined,
    undefined,
    undefined,
    ZERO_ADDRESS,
    {
      send: true,
    },
  ),
] satisfies Permission[];
