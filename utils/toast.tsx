import { ExternalToast, toast as sonnerToast } from 'sonner'
import Toast from '@/ui/toast'
import { CheckCircleOutline, HighlightOff } from '@mui/icons-material'

const toast = {
  successMinimal: (message: string) => {
    sonnerToast.custom(() => (
      <Toast
        message={message}
        type='success'
      />
    ))
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
