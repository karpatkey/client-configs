import { allow as allowAction } from "defi-kit/eth"
import {
  AURA,
  BAL,
  DAI,
  osETH,
  rETH,
  SAFE,
  stETH,
  USDC,
  WETH,
  wstETH,
} from "@/addresses/eth"

export default [
  /*********************************************
   * DeFi-Kit permissions
   *********************************************/
  // Aura - wstETH/WETH
  allowAction.aura.deposit({ targets: ["153"] }),
  // Aura - rETH/WETH
  allowAction.aura.deposit({ targets: ["109"] }),
  // Aura - osETH/WETH
  allowAction.aura.deposit({ targets: ["179"] }),

  // Aave Safety Module - Stake GHO
  allowAction.aave_v3.stake({ targets: ["GHO"] }),

  // Balancer - wstETH/WETH
  allowAction.balancer.deposit({ targets: ["wstETH-WETH-BPT"] }),
  allowAction.balancer.stake({ targets: ["wstETH-WETH-BPT"] }),
  // Balancer - rETH/WETH
  allowAction.balancer.deposit({ targets: ["B-rETH-STABLE"] }),
  allowAction.balancer.stake({ targets: ["B-rETH-STABLE"] }),
  // Balancer - osETH/WETH
  allowAction.balancer.deposit({ targets: ["osETH/wETH-BPT"] }),
  allowAction.balancer.stake({ targets: ["osETH/wETH-BPT"] }),

  // CowSwap - SAFE -> [DAI, ETH, stETH, USDC, WETH, wstETH]
  allowAction.cowswap.swap({
    sell: [SAFE],
    buy: ["ETH", DAI, stETH, USDC, WETH, wstETH],
  }),
  // CowSwap - ETH -> [DAI, osETH, stETH, rETH, USDC, WETH, wstETH]
  allowAction.cowswap.swap({
    sell: ["ETH"],
    buy: [DAI, osETH, stETH, rETH, USDC, WETH, wstETH],
  }),
  // CowSwap - [AURA, BAL] -> [ETH, USDC, WETH]
  allowAction.cowswap.swap({
    sell: [AURA, BAL],
    buy: ["ETH", USDC, WETH],
  }),

  // Lido
  allowAction.lido.deposit(),

  // Uniswap v3 - SAFE + WETH - Current NFT Ids: 711659 and 774338
  allowAction.uniswap_v3.deposit({ tokens: ["SAFE", "WETH"] }),
]
