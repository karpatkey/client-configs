// Tokens
export const AURA = "0x1509706a6c66CA549ff0cB464de88231DDBe213B"
export const BAL = "0x4158734D47Fc9692176B5085E0F52ee0Da5d47F1"
export const cbETH = "0x2Ae3F1Ec7F1F5012CFEab0185bfc7aa3cf0DEc22"
export const cbBTC = "0xcbB7C0000aB88B473b1f5aFd9ef808440eed33Bf"
export const COMP = "0x9e1028F5F1D5eDE59748FFceE5532509976840E0"
export const DAI = "0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb"
export const GHO = "0x6Bb7a212910682DCFdbd5BCBb3e28FB4E8da10Ee"
export const MORPHO = "0xBAa5CC21fd487B8Fcc2F632f3F4E8D37262a0842"
export const USDC = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913"
export const WETH = "0x4200000000000000000000000000000000000006"

// Base Bridge
// Bridges
export const baseBridge = {
  l2CrossDomainMessengerProxy: "0x4200000000000000000000000000000000000007",
  l2StandardBridgeProxy: "0x4200000000000000000000000000000000000010",
}

// Protocols
export const aura = {
  auraAaveUsdcGhoRewarder: "0x28a002a98F4DA7A7B541b5e4d7a42E0F64E4aeF1",
} as const

export const balancerV3 = {
  // BPTs
  aaveUsdcGho: "0x7AB124EC4029316c2A42F713828ddf2a192B36db",

  // Gauges
  aaveUsdcGhoGauge: "0x70DB188E5953f67a4B16979a2ceA26248b315401",
} as const

export const morpho = {
  oracleCbEthUsdc: "0xb40d93F44411D8C09aD17d7F88195eF9b05cCD96",
  oracleCbBtcUsdc: "0x663BECd10daE6C4A3Dcd89F1d76c1174199639B9",
  oraclePTUsde11Dec2025Usdc: "0x15af6e452Fe5C4B78c45f9DE02842a52E600A1cA",
  adaptativeCurveIrm: "0x46415998764C29aB2a25CbeA6254146D50D22687",
} as const

export const pendle = {
  // Markets

  // PTs
  ptUsde11Dec2025: "0x194b8FeD256C02eF1036Ed812Cae0c659ee6F7FD",
} as const
