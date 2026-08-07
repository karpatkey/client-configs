import { allow as allowAction } from "defi-kit/oeth"
import { Parameters } from "../../../parameters"

export default (parameters: Parameters) => [
  /*********************************************
   * Bridges
   *********************************************/

  // Circle v2 - Bridge USDC to Mainnet
  allowAction.circle_v2.bridge({
    targets: ["Ethereum"],
    recipient: parameters.avatar,
  }),
]
