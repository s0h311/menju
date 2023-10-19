import { Dialog } from '@mui/material/'
import { Button, DialogActions, DialogContent, DialogContentText, DialogTitle, Input } from '@mui/material'
import QRCode from 'react-qr-code'
import QRCodeGrid from '@/components/kitchen/qrCodeGrid'
import { useRef, useState } from 'react'
import { useReactToPrint } from 'react-to-print'
import { PrintRounded, CloseRounded } from '@mui/icons-material'

type QRCodeDialogProps = {
  qrCode: string | null
  setQRCode: (value: string | null) => void
}
export default function QRCodeDialog({ qrCode, setQRCode }: QRCodeDialogProps) {
  const [qrCodeAmount, setQRCodeAmount] = useState<number>(1)
  const qrCodeGridRef = useRef<HTMLDivElement>(null)
  const printQrCodes = useReactToPrint({
    content: () => qrCodeGridRef.current,
  })
  const handleBlur = () => {
    if (qrCodeAmount < 0) {
      setQRCodeAmount(0)
    } else if (qrCodeAmount > 100) {
      setQRCodeAmount(100)
    }
  }

  return (
    <Dialog
      open={!!qrCode}
      onClose={() => setQRCode(null)}
      aria-labelledby='alert-dialog-title'
      aria-describedby='alert-dialog-description'
    >
      <DialogTitle id='alert-dialog-title'>{qrCode}</DialogTitle>
      <DialogContent>
        <QRCode
          size={256}
          style={{ height: 'auto', maxWidth: '100%', width: '100%' }}
          value={qrCode ? qrCode : ''}
          viewBox={`0 0 256 256`}
        />
      </DialogContent>
      <DialogActions>
        <div style={{ position: 'absolute', top: '-9999px', left: '-9999px' }}>
          <QRCodeGrid
            forwardedRef={qrCodeGridRef}
            qrCode={qrCode ? qrCode : ''}
            qrCodeAmount={qrCodeAmount}
          />
        </div>
        <Button
          variant='outlined'
          startIcon={<CloseRounded />}
          onClick={() => setQRCode(null)}
          color='warning'
        >
          Schließen
        </Button>
        <div>
          <DialogContentText>Anzahl</DialogContentText>
          <Input
            value={qrCodeAmount}
            size='small'
            onChange={(event) => setQRCodeAmount(Number(event.target.value))}
            onBlur={handleBlur}
            inputProps={{
              min: 1,
              max: 12,
              type: 'number',
            }}
          />
        </div>
        <Button
          variant='outlined'
          endIcon={<PrintRounded />}
          onClick={() => printQrCodes()}
        >
          Ausdrucken
        </Button>
      </DialogActions>
    </Dialog>
  )
}
