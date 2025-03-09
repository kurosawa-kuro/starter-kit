import { z } from 'zod'

export const userSchema = z.object({
  name: z.string()
    .min(1, { message: '名前は必須です' })
    .max(50, { message: '名前は50文字以内で入力してください' }),
  email: z.string()
    .email({ message: '有効なメールアドレスを入力してください' })
    .optional()
    .nullable(),
  password: z.string()
    .min(8, { message: 'パスワードは8文字以上で入力してください' })
    .optional()
    .nullable(),
  avatar: z.string()
    .url({ message: '有効なURL形式で入力してください' })
    .optional()
    .nullable()
})

export type User = z.infer<typeof userSchema>

export const userResponseSchema = z.object({
  success: z.boolean(),
  data: z.union([userSchema, z.array(userSchema)])
})

export type UserResponse = z.infer<typeof userResponseSchema> 