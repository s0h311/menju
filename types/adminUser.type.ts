import { z } from 'zod'

export const zAdminUser = z.object({
  id: z.string().optional(),
  name: z.string().min(2).max(20),
  email: z.string().email(),
  role: z.enum(['Admin', 'Super Admin']),
})

const zPassword = z.object({
  password: z.string().min(8).max(20),
})

export const zRegisterCredentialsAdminUser = zAdminUser.merge(zPassword)

export type AdminUser = z.infer<typeof zAdminUser>
export type RegisterCredentialsAdminUser = z.infer<typeof zRegisterCredentialsAdminUser>
