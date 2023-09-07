import {
  Dialog as MatDialog,
  DialogTitle as Title,
  DialogActions as Actions,
  DialogContent as Content,
  Button,
  ThemeProvider,
  Breakpoint,
  SxProps,
} from '@mui/material'
import { theme } from './theme'
import { ReactNode } from 'react'
import Image from 'next/image'
import { StaticImport } from 'next/dist/shared/lib/get-img-props'

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
}: DialogProps) {
  return (
    <>
      <ThemeProvider theme={theme}>
        <MatDialog
          PaperProps={{ sx: { borderRadius: '16px', maxHeight: '65dvh' } }}
          onClose={onClose}
          open={open}
          fullWidth
          maxWidth={maxWidth || 'xs'}
          aria-labelledby='dialog-title'
          aria-describedby='dialog-description'
        >
          <Title
            id='dialog-title'
            sx={{ p: 0 }}
          >
            {title}
          </Title>
          {imageData?.src && (
            <Image
              className={`rounded-t-2xl mb-2 ${imageData.onClick ? 'cursor-pointer' : ''}`}
              src={imageData.src}
              width={500}
              height={400}
              quality={80}
              alt={imageData.alt}
              onClick={imageData.onClick}
            />
          )}
          <Content
            className='no-scrollbar h-full'
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
            <Button
              sx={{ borderRadius: '16px' }}
              variant='outlined'
              color={revertSuccessError ? 'error' : 'success'}
              onClick={onProceed}
            >
              {proceedText}
            </Button>
          </Actions>
        </MatDialog>
      </ThemeProvider>
    </>
  )
}
