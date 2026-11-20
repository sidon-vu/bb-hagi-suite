import { defineRpcContract } from "@get-bb/plugin-sdk";
import { z } from "zod";

const id = z.string().min(1);

export const hbotShapeSchema = z.enum(["round", "square", "hex"]);
export type HbotShape = z.infer<typeof hbotShapeSchema>;

export const hbotMetadataSchema = z.object({
  id,
  name: z.string().min(1).max(120),
  role: z.string().max(80),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  shape: hbotShapeSchema,
  soul: z.string().max(4096),
  memory: z.string().max(16384),
  playbook: z.string().max(4096),
  createdAt: z.number(),
  updatedAt: z.number(),
  order: z.number().int().nonnegative(),
}).strict();
export type HbotMetadata = z.infer<typeof hbotMetadataSchema>;

export const hbotEpisodeSchema = z.object({
  id,
  botId: id,
  threadId: id.nullable(),
  text: z.string().min(1).max(500),
  createdAt: z.number(),
}).strict();
export type HbotEpisode = z.infer<typeof hbotEpisodeSchema>;

const editFields = {
  name: z.string().trim().min(1).max(120),
  role: z.string().trim().max(80),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  shape: hbotShapeSchema,
  soul: z.string().max(4096),
  memory: z.string().max(16384),
  playbook: z.string().max(4096),
};

const ok = z.object({ ok: z.literal(true) }).strict();

// Tên method prefix hb_ — tách khỏi không gian RPC của bots-sidebar (bot_update...).
export const rpcContract = defineRpcContract({
  hb_bots_list: {
    input: z.null(),
    output: z.object({
      bots: z.array(hbotMetadataSchema),
      threadBindings: z.array(z.object({ threadId: id, botId: id }).strict()),
      userMd: z.string().max(4096),
    }).strict(),
  },
  hb_bot_get: {
    input: z.object({ botId: id }).strict(),
    output: z.object({ bot: hbotMetadataSchema, threadIds: z.array(id) }).strict(),
  },
  hb_bot_create: {
    input: z.object({ ...editFields, soul: editFields.soul.optional(), memory: editFields.memory.optional(), playbook: editFields.playbook.optional() }).strict(),
    output: hbotMetadataSchema,
  },
  hb_bot_update: {
    input: z.object({
      botId: id,
      expectedUpdatedAt: z.number(),
      name: editFields.name.optional(),
      role: editFields.role.optional(),
      color: editFields.color.optional(),
      shape: editFields.shape.optional(),
      soul: editFields.soul.optional(),
      memory: editFields.memory.optional(),
      playbook: editFields.playbook.optional(),
    }).strict(),
    output: hbotMetadataSchema,
  },
  hb_bot_delete: { input: z.object({ botId: id }).strict(), output: ok },
  hb_thread_bind: { input: z.object({ threadId: id, botId: id }).strict(), output: ok },
  hb_thread_unbind: { input: z.object({ threadId: id }).strict(), output: ok },
  hb_user_md_set: { input: z.object({ content: z.string().max(4096) }).strict(), output: ok },
  hb_episode_add: {
    input: z.object({ botId: id, threadId: id.nullable().optional(), text: z.string().trim().min(1).max(500) }).strict(),
    output: hbotEpisodeSchema,
  },
  hb_episodes_list: {
    input: z.object({ botId: id.optional() }).strict(),
    output: z.object({ episodes: z.array(hbotEpisodeSchema) }).strict(),
  },
});
