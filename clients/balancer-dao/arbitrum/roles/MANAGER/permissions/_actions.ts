import { allow as allowAction } from "defi-kit/arb1"
import {
  ARB,
  COW,
  sUSDe,
  USDe,
  USDC,
  USDCe,
  USDT,
  WETH,
} from "@/addresses/arb1"
import { Parameters } from "../../../parameters"
import { wstETH } from "@/addresses/eth"

export default (parameters: Parameters) => [
  // Balancer v2 - axlBAL/BAL
  allowAction.balancer_v2.deposit({ targets: ["axlBAL/BAL"] }),

  // Circle v2 - Bridge USDC to Ethereum
  allowAction.circle_v2.bridge({
    targets: ["Ethereum"],
    recipient: parameters.avatar,
  }),

  // CowSwap - USDC.e -> USDC
  allowAction.cowswap.swap({
    sell: [USDCe],
    buy: [USDC],
  }),

  // CowSwap - [sUSDe, USDe, USDC, USDT] <-> [sUSDe, USDe, USDC, USDT]
  allowAction.cowswap.swap({
    sell: [sUSDe, USDe, USDC, USDT],
    buy: [sUSDe, USDe, USDC, USDT],
  }),

  // CowSwap - [ARB, COW] -> [ETH, sUSDe, USDe, USDC, WETH]
  allowAction.cowswap.swap({
    sell: [ARB, COW],
    buy: ["ETH", sUSDe, USDe, USDC, WETH],
  }),

  // CowSwap - [ETH, WETH, wstETH] <-> [ETH, WETH, wstETH]
  allowAction.cowswap.swap({
    sell: ["ETH", WETH, wstETH],
    buy: ["ETH", WETH, wstETH],
  }),

  // CowSwap - TWAP - [ARB] <-> [ETH, USDC, WETH]
  allowAction.cowswap.swap({
    sell: [ARB],
    buy: ["ETH", USDC, WETH],
    twap: true,
    receiver: parameters.avatar,
  }),

  // Morpho Vault - kpk USDC Yield v1.1
  allowAction.morphoVaults.deposit({
    targets: ["0x2C609d9CfC9dda2dB5C128B2a665D921ec53579d"],
  }),
]
