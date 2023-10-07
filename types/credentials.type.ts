import { z } from 'zod'

export const zLoginCredentials = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(20),
})

export const zRegisterCredentials = z.object({
  name: z.string().min(3).max(20),
  abbreviation: z.string().min(1).max(5),
  email: z.string().email(),
  password: z.string().min(8).max(20),
  restaurantId: z.number(),
})

type StringIndexSignature = {
  [key: string]: string | number
}

export type LoginCredentials = StringIndexSignature & z.infer<typeof zLoginCredentials>
export type RegisterCredentials = StringIndexSignature & z.infer<typeof zRegisterCredentials>
