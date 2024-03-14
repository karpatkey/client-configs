import { Status } from "./types"

declare global {
  namespace jest {
    interface Matchers<R> {
      toRevert(expectedReason?: string | RegExp): R
      toBeAllowed(): R
      toBeForbidden(status?: Status, info?: string): R
    }
  }
}
