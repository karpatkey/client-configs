// Aave v4 - USDC supply reserves. The v4 Spoke identifies reserves by a positional
// `uint256 reserveId`, not by token address: a (hub, asset) pair maps to one reserve. The ids
// below were read onchain with `getReserve(uint256)` (20 Oct 2026). Every scoped call pins them
// explicitly, so a reserve that is added later is not reachable by the role.

// Bluechip Spoke (0x973a023A77420ba610f06b3858aD991Df6d85A08)
export const aaveV4BluechipReserve = {
  usdcPrime: 4, // USDC, Prime Hub 0x943827DCA022D0F354a8a8c332dA1e5Eb9f9F931
} as const

// Main Spoke (0x94e7A5dCbE816e498b89aB752661904E2F56c485)
export const aaveV4MainReserve = {
  usdcCore: 7, // USDC, Core Hub 0xCca852Bc40e560adC3b1Cc58CA5b55638ce826c9
} as const
