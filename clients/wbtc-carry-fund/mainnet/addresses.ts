import {
  cbBTC,
  morpho,
  syrupUSDC,
  syrupUSDT,
  USDC,
  USDT,
  WBTC,
} from "@/addresses/eth"

// Aave v4 - Bluechip Spoke (0x973a023A77420ba610f06b3858aD991Df6d85A08) reserve ids.
//
// The v4 Spoke identifies reserves by a positional `uint256 reserveId`, not by token
// address: a (hub, asset) pair maps to one reserve. The ids below were read on-chain
// with `getReserve(uint256)`. Every scoped call pins them explicitly, so a reserve
// that is added later is not reachable by the role.
export const aaveV4BluechipReserve = {
  wbtcPrime: 1, // WBTC, Prime Hub 0x943827DCA022D0F354a8a8c332dA1e5Eb9f9F931 - collateral only
  cbbtcPrime: 2, // cbBTC, Prime Hub - collateral only
  usdcPrime: 4, // USDC, Prime Hub - borrowable
  usdcCore: 7, // USDC, Core Hub 0xCca852Bc40e560adC3b1Cc58CA5b55638ce826c9 - borrowable
  usdgCore: 11, // USDG, Core Hub - borrowable
} as const

// Aave v4 - Maple SyrupUSDG Spoke (0x774b9655413c34809c1f1b16b654465A89EBE989) reserve ids,
// read onchain with `getReserve(uint256)` the same way. Only the reserves the roles scope
// are listed (reserve 2, USDC on the Global Dollar Hub, is not).
export const aaveV4MapleReserve = {
  usdgGlobalDollar: 0, // USDG, Global Dollar Hub 0x62d63197660c080236193CA60b70E49A08E90368 - borrowable
  syrupUsdg: 1, // syrupUSDG, Global Dollar Hub - collateral only
  usdgCore: 3, // USDG, Core Hub 0xCca852Bc40e560adC3b1Cc58CA5b55638ce826c9 - borrowable
} as const

// Morpho Blue - syrupUSDT/USDT market
// 0xa4774e3e693fff2ebd1dcbbd69b1b0a5b9bb0ccc753bfda5dd07bdac97c4818a. Params read onchain
// with `idToMarketParams(bytes32)` on the Morpho singleton; keccak256(abi.encode(params))
// matches the id.
export const morphoSyrupUsdtUsdtMarket = {
  loanToken: USDT,
  collateralToken: syrupUSDT,
  oracle: morpho.oraclesyrupUsdtUsdt,
  irm: morpho.adaptativeCurveIrm,
  lltv: "915000000000000000", // 91.5%
} as const

// Morpho Blue - backup borrow venues for the BTC leg and syrupUSDC loop markets. Params read
// onchain with `idToMarketParams(bytes32)` on 9 Oct 2026; keccak256(abi.encode(params)) matches
// each id. The BTC markets are the largest WBTC / cbBTC markets against USDC / USDT (86% LLTV);
// the syrupUSDC markets are the two 91.5% syrupUSDC/USDC markets USDC Prime could fund.
export const morphoBackupMarkets = {
  // 0x64d65c9a2d91c36d56fbc42d69e979335320169b3df63bf92789e2c8883fcc64
  cbBtcUsdc: {
    loanToken: USDC,
    collateralToken: cbBTC,
    oracle: morpho.oracleCbBtcUsdc,
    irm: morpho.adaptativeCurveIrm,
    lltv: "860000000000000000",
  },
  // 0x3a85e619751152991742810df6ec69ce473daef99e28a64ab2340d7b7ccfee49
  wbtcUsdc: {
    loanToken: USDC,
    collateralToken: WBTC,
    oracle: morpho.oracleWbtcUsdc,
    irm: morpho.adaptativeCurveIrm,
    lltv: "860000000000000000",
  },
  // 0xa921ef34e2fc7a27ccc50ae7e4b154e16c9799d3387076c421423ef52ac4df99
  wbtcUsdt: {
    loanToken: USDT,
    collateralToken: WBTC,
    oracle: morpho.oracleWbtcUsdt,
    irm: morpho.adaptativeCurveIrm,
    lltv: "860000000000000000",
  },
  // 0x4fe72543c5c95cd6b5f3cb516cd235ba882e2e705fe3424db6f99dfe5811d0d3
  cbBtcUsdt: {
    loanToken: USDT,
    collateralToken: cbBTC,
    oracle: morpho.oracleCbBtcUsdt,
    irm: morpho.adaptativeCurveIrm,
    lltv: "860000000000000000",
  },
  // 0x729badf297ee9f2f6b3f717b96fd355fc6ec00422284ce1968e76647b258cf44
  syrupUsdcUsdc: {
    loanToken: USDC,
    collateralToken: syrupUSDC,
    oracle: morpho.oraclesyrupUsdcUsdc,
    irm: morpho.adaptativeCurveIrm,
    lltv: "915000000000000000",
  },
  // 0x7ddde63e40deefdd5940120f58f88be7a4d11e709335a2024e3b616afbdf7120
  syrupUsdcUsdc2: {
    loanToken: USDC,
    collateralToken: syrupUSDC,
    oracle: morpho.oraclesyrupUsdcUsdc2,
    irm: morpho.adaptativeCurveIrm,
    lltv: "915000000000000000",
  },
} as const
