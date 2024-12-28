"use server"

import { actionClient } from "@/lib/actions/safe-action";
import { UserSchema, userSchema } from "@/lib/schema";
import { type FormState } from "@tanstack/react-form";

const serverUserSchema = userSchema.refine((val) => { return val.username !== "administrator" }, "administrator已存在")

export const createUserAction = actionClient
    .schema(serverUserSchema)
    .action(async ({ parsedInput: { username, email, password, confirmPassword } }) => {
        console.log("Creating user with username:", username);
        console.log("Creating user with email:", email);
        console.log("Creating user with password:", password);
        console.log("Creating user with confirmPassword:", confirmPassword);
        if (Math.random() < 0.5) {
            return { errorMap: { onSubmit: "创建失败" }, errors: ["创建成功"] } as Partial<FormState<UserSchema>>
        } else {
            return { errorMap: { onSubmit: "创建成功" }, errors: ["创建成功"] } as Partial<FormState<UserSchema>>
        }
    });