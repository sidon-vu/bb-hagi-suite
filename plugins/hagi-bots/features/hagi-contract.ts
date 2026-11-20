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
      bots: z.array(
        hbotMetadataSchema.extend({
          projects: z.array(z.object({ id, name: z.string(), role: z.enum(["owner", "member"]) }).strict()),
        }),
      ),
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
  hb_compose_expect: { input: z.object({ botId: id, projectId: id }).strict(), output: ok },
  hb_conversation_create: {
    input: z.object({ botId: id, message: z.string().trim().min(1).max(20000), projectId: id.optional(), providerId: id.optional(), model: z.string().min(1).max(200).optional() }).strict(),
    output: z.object({ threadId: id }).strict(),
  },
  hb_user_md_set: { input: z.object({ content: z.string().max(4096) }).strict(), output: ok },
  hb_episode_add: {
    input: z.object({ botId: id, threadId: id.nullable().optional(), text: z.string().trim().min(1).max(500) }).strict(),
    output: hbotEpisodeSchema,
  },
  hb_episodes_list: {
    input: z.object({ botId: id.optional() }).strict(),
    output: z.object({ episodes: z.array(hbotEpisodeSchema) }).strict(),
  },
  // Nhập từ bots-sidebar: preview read-only trước, apply chỉ chạy khi xác nhận.
  hb_import_preview: {
    input: z.null(),
    output: z.object({
      found: z.boolean(),
      error: z.string().nullable(),
      bots: z.array(z.object({
        id, name: z.string(), role: z.string(), color: z.string(), shape: hbotShapeSchema,
        soulChars: z.number(), memoryChars: z.number(), threadCount: z.number(),
        issues: z.array(z.string()), already: z.boolean(),
      }).strict()),
      bindingCount: z.number(),
      sectionCount: z.number(),
      ownerCount: z.number(),
    }).strict(),
  },
  hb_import_apply: {
    input: z.null(),
    output: z.object({
      imported: z.number(),
      skipped: z.array(z.object({ id, name: z.string(), reason: z.string() }).strict()),
      bindings: z.number(),
      warnings: z.array(z.string()),
    }).strict(),
  },
});
