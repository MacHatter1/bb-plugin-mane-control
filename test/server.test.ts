import assert from "node:assert/strict";
import { createFakePluginHost } from "@get-bb/plugin-sdk/testing";
import plugin from "../src/server.ts";
import { ponytailMessageMode } from "../src/lib/mode-message.ts";
import { isPonytailSkill } from "../src/lib/ponytail-skill.ts";

assert.equal(ponytailMessageMode(" /PONYTAIL OFF "), "off");
assert.equal(ponytailMessageMode("Please use /ponytail off"), null);

assert.equal(isPonytailSkill({ name: "ponytail:ponytail", pluginId: "ponytail" }), true);
assert.equal(isPonytailSkill({ name: "ponytail", pluginId: null, registrySkillId: "dietrichgebert/ponytail/ponytail" }), true);
assert.equal(isPonytailSkill({ name: "other", pluginId: null, registrySkillId: "dietrichgebert/ponytail/ponytail" }), true);
assert.equal(isPonytailSkill({ name: "commit", pluginId: null }), false);

const runHost = async (skills: unknown[]) => {
  const sends: unknown[] = [];
  const { bb, harness } = createFakePluginHost({
    pluginId: "mane-control",
    sdk: {
      threads: {
        get: async () => ({ projectId: "project-1", environmentId: "environment-1" }),
        send: async (input: unknown) => {
          sends.push(input);
          return { accepted: true };
        },
      },
      skills: {
        list: async () => ({ skills }),
      },
    },
  });
  await plugin(bb);
  return { harness, sends };
};

{
  const { harness, sends } = await runHost([
    { id: "skill-hash", name: "ponytail:ponytail", pluginId: "ponytail" },
  ]);
  assert.deepEqual(await harness.behavior.callRpc("get_mode", { threadId: "thread-1" }), {
    mode: "full",
    available: true,
  });
  assert.deepEqual(await harness.behavior.callRpc("set_mode", { threadId: "thread-1", mode: "off" }), {
    mode: "off",
  });
  assert.deepEqual(await harness.behavior.callRpc("get_mode", { threadId: "thread-1" }), {
    mode: "off",
    available: true,
  });
  assert.deepEqual(sends, [
    { threadId: "thread-1", mode: "auto", input: [{ type: "text", text: "/ponytail off", mentions: [] }] },
  ]);
  await harness.lifecycle.dispose();
}

{
  const { harness, sends } = await runHost([
    {
      id: "skill_user",
      name: "ponytail",
      pluginId: null,
      scope: "bb-user",
      registrySkillId: "dietrichgebert/ponytail/ponytail",
    },
  ]);
  assert.deepEqual(await harness.behavior.callRpc("get_mode", { threadId: "thread-2" }), {
    mode: "full",
    available: true,
  });
  assert.deepEqual(await harness.behavior.callRpc("set_mode", { threadId: "thread-2", mode: "lite" }), {
    mode: "lite",
  });
  assert.deepEqual(sends, [
    { threadId: "thread-2", mode: "auto", input: [{ type: "text", text: "/ponytail lite", mentions: [] }] },
  ]);
  await harness.lifecycle.dispose();
}

{
  const { harness } = await runHost([{ id: "skill-other", name: "commit", pluginId: null }]);
  assert.deepEqual(await harness.behavior.callRpc("get_mode", { threadId: "thread-3" }), {
    mode: "full",
    available: false,
  });
  await assert.rejects(
    () => harness.behavior.callRpc("set_mode", { threadId: "thread-3", mode: "ultra" }),
    /Ponytail is required/,
  );
  await harness.lifecycle.dispose();
}
