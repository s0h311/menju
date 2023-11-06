import { CheckCircleOutline, HighlightOff } from '@mui/icons-material'

type ToastProps = {
  message: string
  type: 'success' | 'error'
  onClick?: () => void
}

export default function Toast({ message, type, onClick }: ToastProps) {
  return (
    <div
      className='flex bg-white rounded-lg w-fit space-x-3 items-center p-3 mx-auto shadow-md cursor-pointer'
      onClick={onClick}
    >
      {type === 'success' && <CheckCircleOutline color='success' />}
      {type === 'error' && <HighlightOff color='error' />}
      <p>{message}</p>
    </div>
  )
}
