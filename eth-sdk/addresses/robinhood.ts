// Robinhood Chain (chainId 4663)

// Tokens
export const SPY = "0x117cc2133c37B721F49dE2A7a74833232B3B4C0C" // SPDR S&P 500 ETF Trust - Robinhood Token
export const USDG = "0x5fc5360D0400a0Fd4f2af552ADD042D716F1d168" // Global Dollar (Paxos), native on Robinhood
export const WETH = "0x0Bd7D308f8E1639FAb988df18A8011f41EAcAD73"

// Protocols
export const kpk = {
  kRhUsdShares: "0x71090CBec2698880DA62A4B45D29E4518Bf23C99", // kpk Robinhood USD (kRHUSD) - asset USDG
  kRhEthShares: "0xc71911FbDB63Dfb562c77ba65fEeBB2fb87F9F5a", // kpk Robinhood ETH-USD (kRHETH) - asset USDG
  kRhSpyShares: "0xA4477720a2216B54Acc3db83556820e466257b85", // kpk Robinhood SPY (kRHSPY) - asset SPY
} as const

export const kyberswap = {
  metaAggregationRouterV2: "0x6131B5fae19EA4f9D964eAc0408E4408b66337b5", // same address as mainnet
  aggregatorExecutor: "0x8F10B468b06c6FD214B65F87778827F7D113f996", // executor used on Robinhood
} as const

export const lifi = {
  diamond: "0xB477751B76CF82d00a686A1232f5fCD772414Af3", // LiFi Diamond on Robinhood Chain
} as const
