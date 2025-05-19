import { allow as allowAction } from "defi-kit/eth"
import {
  USDC,
} from "@/addresses/eth"

export default [
  /*********************************************
   * DeFi-Kit permissions
   *********************************************/
  // Aave v3 - Deposit wstETH
  allowAction.aave_v3.deposit({ market: "Core", targets: ["USDC"] }),
]
