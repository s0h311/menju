import {
  Dialog as MatDialog,
  DialogTitle as Title,
  DialogActions as Actions,
  DialogContent as Content,
  Button,
  Breakpoint,
  SxProps,
} from '@mui/material'
import ThemeProvider from '@mui/material/styles/ThemeProvider'
import { theme } from './theme'
import { ReactNode } from 'react'
import Image from 'next/image'
import { StaticImport } from 'next/dist/shared/lib/get-img-props'
import { LoadingButton } from '@mui/lab'

type DialogProps = {
  title?: string
  open: boolean
  closeText: string
  proceedText?: string
  dialogDescription?: string
  maxWidth?: Breakpoint
  sx?: SxProps
  imageData?: {
    src?: string | StaticImport | null
    alt: string
    onClick?: () => void
  } | null
  children: ReactNode
  onClose: () => void
  onProceed?: () => void
  revertSuccessError?: boolean
  loading?: boolean
}

export default function Dialog({
  title,
  open,
  children,
  onClose,
  onProceed,
  closeText,
  proceedText,
  dialogDescription,
  maxWidth,
  sx,
  revertSuccessError,
  imageData,
  loading,
}: DialogProps) {
  return (
    <>
      <ThemeProvider theme={theme}>
        <MatDialog
          PaperProps={{
            sx: { borderRadius: '16px', maxHeight: '75dvh', overflowY: 'scroll' },
            className: 'no-scrollbar',
          }}
          onClose={onClose}
          open={open}
          fullWidth
          maxWidth={maxWidth || 'xs'}
          aria-labelledby='dialog-title'
          aria-describedby='dialog-description'
        >
          {title && <Title id='dialog-title'>{title}</Title>}
          {imageData?.src && (
            <Image
              className={`rounded-t-2xl mb-2 ${imageData.onClick ? 'cursor-pointer' : ''}`}
              style={{ aspectRatio: '16/9' }}
              src={imageData.src}
              width={350}
              height={240}
              quality={70}
              alt={imageData.alt}
              onClick={imageData.onClick}
            />
          )}
          <Content
            className='no-scrollbar'
            sx={sx}
          >
            {children}
            <p id='dialog-description'>{dialogDescription}</p>
          </Content>
          <Actions sx={{ p: '20px' }}>
            <Button
              variant='text'
              color={revertSuccessError ? 'success' : 'error'}
              onClick={onClose}
            >
              {closeText}
            </Button>
            <LoadingButton
              loading={loading}
              sx={{ borderRadius: '16px' }}
              variant='outlined'
              color={revertSuccessError ? 'error' : 'success'}
              onClick={onProceed}
            >
              {proceedText}
            </LoadingButton>
          </Actions>
        </MatDialog>
      </ThemeProvider>
    </>
  )
}
