type SkillLike = {
  name: string;
  pluginId?: string | null;
  registrySkillId?: string | null;
};

/** True for the Ponytail plugin skill or a user/registry install (e.g. skills.sh). */
export const isPonytailSkill = (skill: SkillLike): boolean => {
  if (skill.pluginId === "ponytail") return true;
  if (skill.name === "ponytail" || skill.name.endsWith(":ponytail")) return true;
  const registry = skill.registrySkillId ?? "";
  return registry === "ponytail" || registry.endsWith("/ponytail");
};
