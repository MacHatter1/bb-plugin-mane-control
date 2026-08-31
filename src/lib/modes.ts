export const ponytailModes = ["off", "lite", "full", "ultra"] as const;
export type PonytailMode = (typeof ponytailModes)[number];
