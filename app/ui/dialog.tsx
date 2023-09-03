import {
  Dialog as MatDialog,
  DialogTitle as Title,
  DialogActions as Actions,
  DialogContent as Content,
  Button,
  ThemeProvider,
} from '@mui/material'
import React from 'react'
import { theme } from './theme'
import { Breakpoint, SxProps } from '@mui/system'

type DialogProps = {
  title?: string
  open: boolean
  closeText: string
  proceedText?: string
  dialogDescription?: string
  maxWidth?: Breakpoint
  sx?: SxProps
  children: React.ReactNode
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
}: DialogProps) {
  return (
    <>
      <ThemeProvider theme={theme}>
        <MatDialog
          PaperProps={{ sx: { borderRadius: '16px', maxHeight: '65dvh' } }}
          onClose={onClose}
          open={open}
          fullWidth
          maxWidth={maxWidth || 'lg'}
          aria-labelledby='dialog-title'
          aria-describedby='dialog-description'
        >
          <Title
            id='dialog-title'
            sx={{ p: 0 }}
          >
            {title}
          </Title>
          <Content
            className='no-scrollbar h-full'
            sx={{ ...sx, p: 0 }}
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
