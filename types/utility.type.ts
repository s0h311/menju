import { StorageError } from '@supabase/storage-js/dist/module/lib/errors'

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

