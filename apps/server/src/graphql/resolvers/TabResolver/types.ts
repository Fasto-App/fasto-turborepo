import { TabStatus } from "app-helpers";
import { z } from "zod";

export const createTab = z.object({
	table: z.string(),
	admin: z.string().optional(),
	totalUsers: z.number(),
});

export const updateTabObject = z.object({
	_id: z.string(),
	status: z.nativeEnum(TabStatus),
});

export type createTabInput = { input: z.infer<typeof createTab> };
export type updateTabInput = { input: z.infer<typeof updateTabObject> };
