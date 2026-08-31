import { defineRpcContract, type BbPluginApi } from "@get-bb/plugin-sdk";
import { z } from "zod";
import { ponytailModes, type PonytailMode } from "./lib/modes.ts";

const modeSchema = z.enum(ponytailModes);

export const rpcContract = defineRpcContract({
  get_mode: {
    input: z.object({ threadId: z.string().min(1) }).strict(),
    output: z.object({ mode: modeSchema, available: z.boolean() }).strict(),
  },
  set_mode: {
    input: z.object({ threadId: z.string().min(1), mode: modeSchema }).strict(),
    output: z.object({ mode: modeSchema }).strict(),
  },
});

export default function plugin(bb: BbPluginApi) {
  const key = (threadId: string) => `mode:${threadId}`;
  const hasPonytail = async (threadId: string) => {
    const thread = await bb.sdk.threads.get({ threadId });
    const { skills } = await bb.sdk.skills.list({
      projectId: thread.projectId,
      environmentId: thread.environmentId,
    });
    return skills.some(
      (skill) =>
        skill.pluginId === "ponytail" &&
        (skill.name === "ponytail" || skill.name.endsWith(":ponytail")),
    );
  };

  bb.rpc.register(rpcContract, {
    get_mode: async ({ threadId }) => ({
      mode: (await bb.storage.kv.get<PonytailMode>(key(threadId))) ?? "full",
      available: await hasPonytail(threadId),
    }),
    set_mode: async ({ threadId, mode }) => {
      if (!(await hasPonytail(threadId))) {
        throw new Error("Ponytail is required. Install and enable Ponytail before using Mane Control.");
      }
      await bb.sdk.threads.send({
        threadId,
        mode: "auto",
        input: [{ type: "text", text: `/ponytail ${mode}`, mentions: [] }],
      });
      await bb.storage.kv.set(key(threadId), mode);
      bb.realtime.publish("mode-changed", { threadId, mode });
      return { mode };
    },
  });
}
