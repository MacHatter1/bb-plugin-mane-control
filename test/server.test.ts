import assert from "node:assert/strict";
import { createFakePluginHost } from "@get-bb/plugin-sdk/testing";
import plugin from "../src/server.ts";
import { ponytailMessageMode } from "../src/lib/mode-message.ts";

assert.equal(ponytailMessageMode(" /PONYTAIL OFF "), "off");
assert.equal(ponytailMessageMode("Please use /ponytail off"), null);

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
      list: async () => ({
        skills: [{ id: "skill-hash", name: "ponytail:ponytail", pluginId: "ponytail" }],
      }),
    },
  },
});

await plugin(bb);
assert.deepEqual(await harness.behavior.callRpc("get_mode", { threadId: "thread-1" }), { mode: "full", available: true });
assert.deepEqual(await harness.behavior.callRpc("set_mode", { threadId: "thread-1", mode: "off" }), { mode: "off" });
assert.deepEqual(await harness.behavior.callRpc("get_mode", { threadId: "thread-1" }), { mode: "off", available: true });
assert.deepEqual(sends, [{ threadId: "thread-1", mode: "auto", input: [{ type: "text", text: "/ponytail off", mentions: [] }] }]);
await harness.lifecycle.dispose();
