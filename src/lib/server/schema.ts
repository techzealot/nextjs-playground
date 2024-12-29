import { userSchema } from "@/lib/share/schema"

export const serverUserSchema = userSchema.refine((val) => { return val.username !== "administrator" }, "administrator已存在")
