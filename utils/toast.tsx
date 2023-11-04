import type { ExternalToast } from 'sonner'
import { toast as sonnerToast } from 'sonner'
import Toast from '@/ui/toast'
import { CheckCircleOutline, HighlightOff } from '@mui/icons-material'

const toast = {
  successMinimal: (message: string) => {
    const toastId = Math.floor(Math.random() * 100)

    sonnerToast.custom(
      () => (
        <Toast
          message={message}
          type='success'
          onClick={() => sonnerToast.dismiss(toastId)}
        />
      ),
      {
        id: toastId,
        duration: 1000,
      }
    )
  },

  success: (message: string, configs?: ExternalToast) =>
    sonnerToast.success(message, {
      ...configs,
      icon: <CheckCircleOutline color='success' />,
    }),

  errorMinimal: (message: string) => {
    sonnerToast.custom(() => (
      <Toast
        message={message}
        type='error'
      />
    ))
  },

  error: (message: string, configs?: ExternalToast) =>
    sonnerToast.error(message, {
      ...configs,
      icon: <HighlightOff color='error' />,
    }),
}

export default toast
