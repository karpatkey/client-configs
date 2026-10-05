import { c } from "zodiac-roles-sdk"
import { encodeBytes32String } from "defi-kit"

/**
 * OIV settlement guard (S1 interim fix) for `kpkShares.processRequests`.
 *
 * The settlement bot's permission carries two limits: an inclusive price band on
 * `sharesPriceInAsset` and a call budget (`CallWithinAllowance`). Ops choose every
 * number; this file only provides the mechanism. See
 * `.claude/skills/oiv-settlement-guard/SKILL.md`.
 */

/**
 * Placeholder for a value ops still have to choose. Its type is not assignable to any
 * `SettlementGuard` field, so `yarn check:types` fails while it is present, and
 * `settlementGuardScope` rejects it at runtime (e.g. under `yarn apply`, which does
 * not type-check).
 */
export const TODO_OPS: unique symbol = Symbol("TODO_OPS")

export interface SettlementGuard {
  /** Inclusive lower bound of `sharesPriceInAsset`: integer string, 8-decimal fixed point. */
  sharesPriceMin: string
  /** Inclusive upper bound of `sharesPriceInAsset`: integer string, 8-decimal fixed point. */
  sharesPriceMax: string
  /**
   * Call budget for `processRequests`. Written on-chain with `setAllowance`
   * (`scripts/settlementGuard.ts allowance-tx`); `yarn apply` does NOT set it.
   */
  callAllowance: {
    balance: number
    maxRefill: number
    refill: number
    periodSeconds: number
  }
}

/** Allowance key consumed once per `processRequests` call. Fixed; ops never choose it. */
export const SETTLEMENT_GUARD_ALLOWANCE_KEY = encodeBytes32String(
  "processRequests-calls"
) as `0x${string}`

const POSITIVE_INTEGER = /^[1-9][0-9]*$/

const fail = (where: string, message: string): never => {
  throw new Error(
    `${where}: invalid settlementGuard — ${message}. Ops must set it in the instance parameters (see the oiv-settlement-guard skill).`
  )
}

/** Validates a settlement guard config and returns it typed, or throws. */
export const validateSettlementGuard = (
  guard: unknown,
  where: string
): SettlementGuard => {
  if (guard === undefined || guard === null)
    return fail(where, "missing (no settlementGuard in this instance)")
  if (typeof guard !== "object") return fail(where, "not an object")
  const g = guard as Record<string, unknown>

  for (const field of ["sharesPriceMin", "sharesPriceMax"] as const) {
    const value = g[field]
    if (value === TODO_OPS) fail(where, `${field} is still TODO_OPS`)
    if (typeof value !== "string" || !POSITIVE_INTEGER.test(value))
      fail(
        where,
        `${field} must be a positive integer string (8-decimal fixed point)`
      )
  }
  if (BigInt(g.sharesPriceMin as string) >= BigInt(g.sharesPriceMax as string))
    fail(where, "sharesPriceMin must be lower than sharesPriceMax")

  const allowance = g.callAllowance
  if (typeof allowance !== "object" || allowance === null)
    return fail(where, "callAllowance is missing")
  const a = allowance as Record<string, unknown>
  for (const field of [
    "balance",
    "maxRefill",
    "refill",
    "periodSeconds",
  ] as const) {
    const value = a[field]
    if (value === TODO_OPS)
      fail(where, `callAllowance.${field} is still TODO_OPS`)
    if (typeof value !== "number" || !Number.isSafeInteger(value) || value < 0)
      fail(where, `callAllowance.${field} must be a non-negative integer`)
  }
  // maxRefill 0 means "unlimited" on the Roles modifier, which would disable the budget.
  if (a.maxRefill === 0) fail(where, "callAllowance.maxRefill must be > 0")
  if (a.refill === 0) fail(where, "callAllowance.refill must be > 0")
  if (a.periodSeconds === 0)
    fail(where, "callAllowance.periodSeconds must be > 0")

  return guard as SettlementGuard
}

/**
 * Builds the guarded part of the `processRequests` permission: the inclusive band on
 * `sharesPriceInAsset` and the `callWithinAllowance` option. Throws on a missing or
 * invalid config, so a role can never be compiled without its guard.
 */
export const settlementGuardScope = (guard: unknown, where: string) => {
  const g = validateSettlementGuard(guard, where)
  return {
    sharesPriceInAsset: c.and(
      c.gte(BigInt(g.sharesPriceMin)),
      c.lte(BigInt(g.sharesPriceMax))
    ),
    options: { callWithinAllowance: SETTLEMENT_GUARD_ALLOWANCE_KEY },
  }
}
