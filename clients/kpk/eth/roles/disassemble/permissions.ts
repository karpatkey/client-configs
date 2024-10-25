import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import {
    CRV,
    COMP,
    CVX,
    DAI,
    NOTE,
    rETH,
    USDC,
    USDT,
    stETH,
    WETH,
    wstETH,
    aura,
    balancer,
    E_ADDRESS
} from "../../../../../eth-sdk/addresses"
import { contracts } from "../../../../../eth-sdk/config"
import { allowErc20Approve } from "../../../../../utils/erc20"
import { PermissionList } from "../../../../../types"
import { aura__withdraw_balancer } from "../../../../../helpers/exit_strategies/aura"
import {
    balancer__swap,
} from "../../../../../helpers/exit_strategies/balancer"
import { cowswap__swap } from "../../../../../helpers/exit_strategies/cowswap"
import {
    lido__unstake_stETH,
    lido__unwrap_and_unstake_wstETH,
} from "../../../../../helpers/exit_strategies/lido"
import { Chain } from "../../../../../types"

export default [
    /*********************************************
    * DeFi-Kit permissions
    *********************************************/

    // Aura - wstETH/WETH
    aura__withdraw_balancer(aura.auraB_stETH_stable_rewarder, balancer.B_stETH_stable_pid),

    // CowSwap - Holdings
    cowswap__swap([DAI, USDC, USDT], [DAI, USDC, USDT, WETH], Chain.eth),
    cowswap__swap([CRV, COMP, CVX, NOTE], [DAI, USDC], Chain.eth),

    // Lido
    lido__unstake_stETH(),
    lido__unwrap_and_unstake_wstETH(),

    // Spark - DSR sDAI
    allow.mainnet.spark.sDAI.redeem(undefined, c.avatar, c.avatar),
    allow.mainnet.spark.sDAI.withdraw(undefined, c.avatar, c.avatar),

    // Wrapping and unwrapping of ETH, WETH
    allow.mainnet.weth.withdraw(),

    // Compound v3 - USDC
    allow.mainnet.compound_v3.cUSDCv3.withdraw(USDC),

    // Curve - Tricrypto GHO (GHO/WBTC/wstETH)
    allow.mainnet.curve.tricryptoGHO_pool[
        "remove_liquidity(uint256,uint256[3],bool)"
    ](),
    allow.mainnet.curve.tricryptoGHO_pool[
        "remove_liquidity_one_coin(uint256,uint256,uint256,bool)"
    ](),
    allow.mainnet.curve.tricryptoGHO_gauge["withdraw(uint256)"](),

    /*********************************************
    * SWAPS
    *********************************************/

    // Balancer - Swap rETH <-> WETH
    balancer__swap(balancer.B_rETH_stable_pid, [rETH, WETH], [rETH, WETH]),

    // Balancer - Swap WETH <-> wstETH
    balancer__swap(balancer.B_stETH_stable_pid, [WETH, wstETH], [wstETH, WETH]),

    // CowSwap - DAI -> [ETH, USDC, USDT]
    cowswap__swap([DAI], [E_ADDRESS, USDC, USDT], Chain.eth),

    // CowSwap - USDT -> [USDC, DAI, E_ADDRESS]
    cowswap__swap([USDT], [USDC, DAI, E_ADDRESS], Chain.eth),

    // Cowswap - USDC -> [DAI, USDT, E_ADDRESS]
    cowswap__swap([USDC], [DAI, USDT, E_ADDRESS], Chain.eth),

    // Cowswap - [ETH, WETH] -> [DAI, USDT, USDC]
    cowswap__swap([E_ADDRESS, WETH], [DAI, USDT, USDC], Chain.eth),

    // Curve - Swaps in 3pool
    ...allowErc20Approve([DAI, USDC, USDT], [contracts.mainnet.curve.x3CRV_pool]),
    allow.mainnet.curve.x3CRV_pool["exchange"](),

    // Curve - Swap ETH/stETH (steCRV)
    ...allowErc20Approve([stETH], [contracts.mainnet.curve.steth_eth_pool]),
    allow.mainnet.curve.steth_eth_pool["exchange"](),

    // Curve - Swaps ETH/stETH (stETH-ng-f)
    ...allowErc20Approve([stETH], [contracts.mainnet.curve.stETH_ng_f_pool]),
    allow.mainnet.curve.stETH_ng_f_pool[
        "exchange(int128,int128,uint256,uint256)"
    ](),

    // Uniswap V3 - Swaps
    ...allowErc20Approve(
        [DAI, USDC, USDT, WETH, wstETH],
        [contracts.mainnet.uniswap_v3.router_2]
    ),
    allow.mainnet.uniswap_v3.router_2.exactInputSingle(
        {
            tokenIn: c.or(DAI, USDC, USDT, WETH, wstETH),
            tokenOut: c.or(DAI, USDC, USDT, WETH, wstETH),
            recipient: c.avatar,
        },
        {
            send: true,
        }
    ),

] satisfies PermissionList
