import { StorageError } from '@supabase/storage-js/dist/module/lib/errors'
import { z } from 'zod'

//TODO can be replaced when this PR to supabase/storage-js is merged: https://github.com/supabase/storage-js/pull/177
export type StorageUploadResponse =
  | {
      data: { path: string }
      error: null
    }
  | {
      data: null
      error: StorageError
    }

export const zImageFile = z.object({
  name: z.string(),
  file: z.any(),
})

export type ImageFile = z.infer<typeof zImageFile>
