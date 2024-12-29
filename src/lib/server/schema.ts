import { userSchema } from "@/lib/share/schema"
//服务端增强校验:
// 1.用户名邮箱是否已存在
// 2.其他必须在服务端处理的附加规则
export const serverUserSchema = userSchema.refine(
    (val) => { return val.username !== "administrator" },
    { message: "administrator已存在", path: ["username"] }
)
