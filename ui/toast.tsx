import { CheckCircleOutline, HighlightOff } from '@mui/icons-material'

type ToastProps = {
  message: string
  type: 'success' | 'error'
}

export default function Toast({ message, type }: ToastProps) {
  return (
    <div className='flex bg-white rounded-lg w-fit space-x-3 items-center p-3 mx-auto shadow-md'>
      {type === 'success' && <CheckCircleOutline color='success' />}
      {type === 'error' && <HighlightOff color='error' />}
      <p>{message}</p>
    </div>
  )
}
