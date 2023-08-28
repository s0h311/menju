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

type DialogProps = {
  title?: string
  open: boolean
  closeText: string
  proceedText?: string
  dialogDescription?: string
  children: React.ReactNode
  onClose: () => void
  onProceed?: () => void
  proceedDisabled?: boolean
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
  proceedDisabled,
}: DialogProps) {
  return (
    <>
      <ThemeProvider theme={theme}>
        <MatDialog
          PaperProps={{ sx: { borderRadius: '16px', maxHeight: '65dvh' } }}
          onClose={onClose}
          open={open}
          fullWidth={true}
          maxWidth='lg'
          aria-labelledby='dialog-title'
          aria-describedby='dialog-description'
        >
          <Title
            id='dialog-title'
            sx={{ pt: 3 }}
          >
            {title}
          </Title>
          <Content
            className='no-scrollbar'
            sx={{ p: 0 }}
          >
            {children}
            <p id='dialog-description'>{dialogDescription}</p>
          </Content>
          <Actions sx={{ p: '20px' }}>
            <Button
              variant='text'
              color='accent'
              onClick={onClose}
            >
              {closeText}
            </Button>
            <Button
              sx={{ borderRadius: '16px' }}
              variant='outlined'
              color='accent'
              onClick={onProceed}
              disabled={proceedDisabled}
            >
              {proceedText}
            </Button>
          </Actions>
        </MatDialog>
      </ThemeProvider>
    </>
  )
}
