import { ponytailModes, type PonytailMode } from "./modes.ts";

export function ponytailMessageMode(text: string): PonytailMode | null {
  const normalized = text.trim().toLowerCase();
  return ponytailModes.find((mode) => normalized === `/ponytail ${mode}`) ?? null;
}
