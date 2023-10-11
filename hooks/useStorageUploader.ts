import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import type { StorageUploadResponse } from '@/types/utility.type'

const supabaseClient = createClientComponentClient()

enum Storages {
  IMAGE = 'pictures',
}

const getFullStorageUrl = (): string | undefined => {
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_STORAGE_URL) {
    return process.env.NEXT_PUBLIC_SUPABASE_URL + process.env.NEXT_PUBLIC_SUPABASE_STORAGE_URL
  }
}

const getUserId = async (): Promise<string> => {
  const session = await supabaseClient.auth.getSession()
  return session.data.session?.user.id || ''
}

export default function useStorageUploader() {
  const upload = async (fileName: string, file: File, storage: string): Promise<StorageUploadResponse> =>
    supabaseClient.storage.from(storage).upload(fileName, file)

  const uploadImage = async (file: File): Promise<StorageUploadResponse> => {
    const userId = await getUserId()
    const fileName = userId + '/' + Date.now().toString() + '.' + file.name.split('.').pop()
    return upload(fileName, file, Storages.IMAGE).then((res) => {
      if (res.data) res.data.path = getImageUrl(res.data.path)
      return res
    })
  }

  const getImageUrl = (imagePath: string): string => {
    if (getFullStorageUrl() && imagePath) {
      return getFullStorageUrl() + imagePath
    }
    return ''
  }

  const removeImage = async (imagePaths: string[]): Promise<void> => {
    let imagesInStorage = imagePaths.filter((path) => path.includes(getFullStorageUrl()!))
    if (getFullStorageUrl() && imagesInStorage.length) {
      imagesInStorage = imagesInStorage.map((path) => path.split('/').slice(-2).join('/'))
      await supabaseClient.storage.from(Storages.IMAGE).remove(imagesInStorage)
    }
  }

  return { uploadImage, removeImage }
}
