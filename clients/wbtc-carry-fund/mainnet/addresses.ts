// Aave v4 - Bluechip Spoke (0x973a023A77420ba610f06b3858aD991Df6d85A08) reserve ids.
//
// The v4 Spoke identifies reserves by a positional `uint256 reserveId`, not by token
// address: a (hub, asset) pair maps to one reserve. The ids below were read on-chain
// with `getReserve(uint256)`. Every scoped call pins them explicitly, so a reserve
// that is added later is not reachable by the role.
export const aaveV4BluechipReserve = {
  wbtcPrime: 1, // WBTC, Prime Hub 0x943827DCA022D0F354a8a8c332dA1e5Eb9f9F931 - collateral only
  usdcPrime: 4, // USDC, Prime Hub - borrowable
  usdcCore: 7, // USDC, Core Hub 0xCca852Bc40e560adC3b1Cc58CA5b55638ce826c9 - borrowable
} as const
