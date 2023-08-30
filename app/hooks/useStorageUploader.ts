import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { StorageUploadResponse } from '@/app/types/utility.type'

const supabaseClient = createClientComponentClient()

enum Storages {
  IMAGE = 'pictures',
}

export default function useStorageUploader() {
  const upload = async (fileName: string, file: File, storage: string): Promise<StorageUploadResponse> =>
    await supabaseClient.storage.from(storage).upload(fileName, file)

  const uploadImage = async (file: File): Promise<StorageUploadResponse> => {
    const fileName = Date.now().toString() + file.name.split('.').pop()
    const { data, error } = await upload(fileName, file, Storages.IMAGE)
    if (data) data.path = getImageUrl(data?.path)
    return new Promise(() => ({
      data,
      error,
    }))
  }

  const getImageUrl = (imagePath?: string): string => {
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_STORAGE_URL) {
      return process.env.NEXT_PUBLIC_SUPABASE_URL + process.env.NEXT_PUBLIC_SUPABASE_STORAGE_URL + imagePath
    }
    return ''
  }

  return { uploadImage }
}
