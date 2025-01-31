export interface Parameters {
  avatar: `0x${string}`
  kpkGovernance: `0x${string}`
}

export const defaultParameters = {
  kpkGovernance: "0x8787FC2De4De95c53e5E3a4e5459247D9773ea52", // governance.karpatkey.eth
} as const
