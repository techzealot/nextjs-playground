import { formOptions } from '@tanstack/react-form';
import z from 'zod';

// all properties are required by default
const userSchema = z.object({
    username: z.string({ required_error: "Username is required" }).min(8, "用户名必须大于8个字符").max(20),
    email: z.string({ required_error: "Email is required" }).email("无效的邮箱格式"),
    password: z.string({ required_error: "Password is required" }).min(8, "密码必须大于8个字符").max(20, "密码必须小于20个字符"),
    confirmPassword: z.string({ required_error: "Confirm Password is required" }).min(8, "确认密码必须大于8个字符").max(20, "确认密码必须小于20个字符"),
}).superRefine((val, ctx) => {
    if (val.password !== val.confirmPassword) {
        return ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: '两次密码不匹配',
            path: ['confirmPassword']
        })
    }

})

export const userFormOpts = formOptions({
    defaultValues: {
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    },
})


export type UserSchema = z.infer<typeof userSchema>;
export { userSchema };
