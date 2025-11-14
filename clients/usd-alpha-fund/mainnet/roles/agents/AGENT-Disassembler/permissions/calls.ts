import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import { PermissionList } from "@/types"
import {
  crvUSD,
  DAI,
  sDAI,
  sUSDe,
  USDC,
  USDe,
  USDT,
  WBTC,
  wstETH,
  morpho,
  USDS,
} from "@/addresses/eth"

export default [
  // Aave v3 Core Market - Withdraw crvUSD
  allow.mainnet.aaveV3.poolCoreV3.withdraw(crvUSD, undefined, c.avatar),
  // Aave v3 Core Market - Withdraw DAI
  allow.mainnet.aaveV3.poolCoreV3.withdraw(DAI, undefined, c.avatar),
  // Aave v3 Core Market - Withdraw sDAI
  allow.mainnet.aaveV3.poolCoreV3.withdraw(sDAI, undefined, c.avatar),
  // Aave v3 Core Market - Withdraw sUSDe
  allow.mainnet.aaveV3.poolCoreV3.withdraw(sUSDe, undefined, c.avatar),
  // Aave v3 Core Market - Withdraw USDC
  allow.mainnet.aaveV3.poolCoreV3.withdraw(USDC, undefined, c.avatar),
  // Aave v3 Core Market - Withdraw USDe
  allow.mainnet.aaveV3.poolCoreV3.withdraw(USDe, undefined, c.avatar),
  // Aave v3 Core Market - Withdraw USDS
  allow.mainnet.aaveV3.poolCoreV3.withdraw(USDS, undefined, c.avatar),
  // Aave v3 Core Market - Withdraw USDT
  allow.mainnet.aaveV3.poolCoreV3.withdraw(USDT, undefined, c.avatar),

  // Compound v3 - Withdraw USDC
  allow.mainnet.compoundV3.cUsdcV3.withdraw(USDC),

  // Morpho Market - USDC/wstETH - id: 0xb323495f7e4148be5643a4ea4a8221eef163e4bccfdedc2a6f4696baacbc86cc
  allow.mainnet.morpho.morphoBlue.withdraw(
    {
      loanToken: USDC,
      collateralToken: wstETH,
      oracle: morpho.oracleWstEthUsdc,
      irm: morpho.adaptativeCurveIrm,
      lltv: "860000000000000000",
    },
    undefined,
    undefined,
    c.avatar,
    c.avatar
  ),
  // Morpho Market - USDC/WBTC - id: 0x3a85e619751152991742810df6ec69ce473daef99e28a64ab2340d7b7ccfee49
  allow.mainnet.morpho.morphoBlue.withdraw(
    {
      loanToken: USDC,
      collateralToken: WBTC,
      oracle: morpho.oracleWbtcUsdc,
      irm: morpho.adaptativeCurveIrm,
      lltv: "860000000000000000",
    },
    undefined,
    undefined,
    c.avatar,
    c.avatar
  ),
  // Morpho Market - USDT/WBTC - id: 0xa921ef34e2fc7a27ccc50ae7e4b154e16c9799d3387076c421423ef52ac4df99
  allow.mainnet.morpho.morphoBlue.withdraw(
    {
      loanToken: USDT,
      collateralToken: WBTC,
      oracle: morpho.oracleWbtcUsdt,
      irm: morpho.adaptativeCurveIrm,
      lltv: "860000000000000000",
    },
    undefined,
    undefined,
    c.avatar,
    c.avatar
  ),
] satisfies PermissionList
