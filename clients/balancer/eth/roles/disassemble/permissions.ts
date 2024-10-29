import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import {
    E_ADDRESS,
    AAVE,
    COMP,
    DAI,
    GHO,
    GYD,
    OETH,
    osETH,
    rETH,
    sDAI,
    sUSDS,
    stETH,
    stkAAVE,
    stkGHO,
    SWISE,
    USDC,
    USDS,
    USDT,
    WBTC,
    WETH,
    wstETH,
    balancer,
    convex
} from "../../../../../eth-sdk/addresses"
import { contracts } from "../../../../../eth-sdk/config"
import { allowErc20Approve } from "../../../../../utils/erc20"
import { PermissionList } from "../../../../../types"
import {
    balancer__swap,
    convex__withdraw,
    cowswap__swap,
    lido__unstake_stETH,
    lido__unwrap_and_unstake_wstETH
} from "../../../../../helpers/exit_strategies"
import { Chain } from "../../../../../types"

export default [
    /*********************************************
     * Protocol permissions
     *********************************************/
    // Unwrap ETH
    allow.mainnet.weth.withdraw(),

    // Aave v3 - Withdraw DAI
    allow.mainnet.aave_v3.pool_v3.withdraw(DAI, undefined, c.avatar),
    // Aave v3 - Withdraw osETH
    allow.mainnet.aave_v3.pool_v3.withdraw(osETH, undefined, c.avatar),
    // Aave v3 - Withdraw sDAI
    allow.mainnet.aave_v3.pool_v3.withdraw(sDAI, undefined, c.avatar),
    // Aave v3 - Withdraw USDC
    allow.mainnet.aave_v3.pool_v3.withdraw(USDC, undefined, c.avatar),
    // Aave v3 - Withdraw USDS
    allow.mainnet.aave_v3.pool_v3.withdraw(USDS, undefined, c.avatar),
    // Aave v3 - Withdraw WBTC
    allow.mainnet.aave_v3.pool_v3.withdraw(WBTC, undefined, c.avatar),
    // Aave v3 - Withdraw wstETH
    allow.mainnet.aave_v3.pool_v3.withdraw(wstETH, undefined, c.avatar),
    // Aave v3 - Repay GHO
    ...allowErc20Approve([GHO], [contracts.mainnet.aave_v3.pool_v3]),
    allow.mainnet.aave_v3.pool_v3.repay(GHO, undefined, undefined, c.avatar),

    // Convex - ETH/OETH
    convex__withdraw(convex.EthOeth_rewarder),

    // CowSwap - Holdings
    cowswap__swap([
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
    ], [DAI, rETH, stETH, USDC, USDT, WBTC, WETH, wstETH], Chain.eth),
    cowswap__swap([DAI, GHO, GYD, sDAI, USDC, USDT], [DAI, GHO, GYD, sDAI, USDC, USDT], Chain.eth),
    cowswap__swap([GHO, stkGHO], [GHO, stkGHO], Chain.eth),
    cowswap__swap([USDS], [DAI, sUSDS, USDC, USDT], Chain.eth),
    cowswap__swap([sUSDS], [DAI, USDC, USDS, USDT], Chain.eth),
    cowswap__swap([OETH], [E_ADDRESS, rETH, stETH, WETH, wstETH], Chain.eth),

    // Lido
    lido__unstake_stETH(),
    lido__unwrap_and_unstake_wstETH(),

    // Spark - DSR/sDAI
    allow.mainnet.spark.sDAI.redeem(undefined, c.avatar, c.avatar),
    allow.mainnet.spark.sDAI.withdraw(undefined, c.avatar, c.avatar),
    // Spark - SKY_USDS
    allow.mainnet.spark.sUSDS.withdraw(undefined, c.avatar, c.avatar),

    // Uniswap v3 - WBTC + WETH
    allow.mainnet.uniswap_v3.positions_nft.decreaseLiquidity(),
    allow.mainnet.uniswap_v3.positions_nft.collect({
        recipient: c.avatar,
    }),

    // Compound v3 - USDC
    allow.mainnet.compound_v3.cUSDCv3.withdraw(USDC),

    // Curve - ETH/OETH
    allow.mainnet.curve.OETHCRV_f_pool["remove_liquidity(uint256,uint256[2])"](),
    allow.mainnet.curve.OETHCRV_f_pool[
        "remove_liquidity_imbalance(uint256[2],uint256)"
    ](),
    allow.mainnet.curve.OETHCRV_f_pool[
        "remove_liquidity_one_coin(uint256,int128,uint256)"
    ](),
    allow.mainnet.curve.OETHCRV_f_gauge["withdraw(uint256)"](),

    // StakeWise v3 - Genesis Vault
    allow.mainnet.stakewise_v3.genesis.burnOsToken(),
    allow.mainnet.stakewise_v3.genesis.enterExitQueue(undefined, c.avatar),
    allow.mainnet.stakewise_v3.genesis.claimExitedAssets(),


    /*********************************************
   * SWAPS
   *********************************************/
    // Balancer - Swap COMP -> WETH
    balancer__swap(balancer.B_50COMP_50WETH_pId, [COMP], [WETH]),

    // Balancer - Swap WETH -> DAI
    balancer__swap(balancer.B_60WETH_40DAI_pId, [WETH], [DAI]),

    // Balancer - Swap WETH -> USDC
    balancer__swap(balancer.B_50USDC_50WETH_pId, [WETH], [USDC]),

    // Balancer - Swap WETH <-> wstETH
    balancer__swap(balancer.B_stETH_stable_pid, [WETH, wstETH], [WETH, wstETH]),

    // Balancer - Swap WETH <-> wstETH
    balancer__swap(balancer.ECLP_wstETH_wETH_pId, [WETH, wstETH], [WETH, wstETH]),

    // Balancer - Swap rETH <-> WETH
    balancer__swap(balancer.B_rETH_stable_pid, [rETH, WETH], [rETH, WETH]),

    // Balancer - Swap GYD <-> USDT
    balancer__swap(balancer.ECLP_GYD_USDT_pId, [GYD, USDT], [GYD, USDT]),

    // Balancer - Swap GYD <-> sDAI
    balancer__swap(balancer.ECLP_GYD_sDAI_pId, [GYD, sDAI], [GYD, sDAI]),

    // Balancer - Swap GYD <-> sDAI
    balancer__swap(balancer.ECLP_GYD_sDAI_2_pId, [GYD, sDAI], [GYD, sDAI]),

    // Balancer - Swap GYD <-> USDC
    balancer__swap(balancer.ECLP_GYD_USDC_pId, [GYD, USDC], [GYD, USDC]),

    // Balancer - Swap GHO <-> GYD
    balancer__swap(balancer.ECLP_GHO_GYD_pId, [GHO, GYD], [GHO, GYD]),

    // Balancer - Swap GHO <-> [USDC, USDT]
    balancer__swap(balancer.GHO_USDT_USDC_pId, [GHO], [USDC, USDT]),
    balancer__swap(balancer.GHO_USDT_USDC_pId, [USDC, USDT], [GHO]),

    // Curve - Swap ETH <-> stETH
    allowErc20Approve([stETH], [contracts.mainnet.curve.steth_eth_pool]),
    allow.mainnet.curve.steth_eth_pool.exchange(
        undefined,
        undefined,
        undefined,
        undefined,
        {
            send: true,
        }
    ),

    // Curve - Swap ETH <-> OETH
    allowErc20Approve([OETH], [contracts.mainnet.curve.OETHCRV_f_pool]),
    allow.mainnet.curve.OETHCRV_f_pool["exchange(int128,int128,uint256,uint256)"](
        undefined,
        undefined,
        undefined,
        undefined,
        {
            send: true,
        }
    ),

    // Uniswap v3 - Swaps
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
        [contracts.mainnet.uniswap_v3.router_2]
    ),

    // Uniswap v3 - Swapping of tokens AAVE, COMP, DAI, rETH, stETH, stkAAVE, SWISE, USDC, USDT, WBTC, WETH, wstETH
    allow.mainnet.uniswap_v3.router_2.exactInputSingle({
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
] satisfies PermissionList
