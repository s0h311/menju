import { Box } from '@mui/material'
import { Grid } from '@mui/material/'
import QRCode from 'react-qr-code'

type QRCodeGridProps = {
  forwardedRef: React.RefObject<HTMLDivElement>
  qrCode: string
  qrCodeAmount: number
}

export default function QRCodeGrid({ forwardedRef, qrCode, qrCodeAmount }: QRCodeGridProps) {
  const qrCodes = []

  for (let qrCodeIndex = 0; qrCodeIndex < qrCodeAmount; qrCodeIndex++) {
    qrCodes.push(
      <Grid
        item
        key={qrCodeIndex}
        style={{ border: '1px solid black' }}
      >
        <QRCode
          size={256}
          value={qrCode}
        />
      </Grid>
    )
  }
  return (
    <Box
      sx={{ width: '100%' }}
      ref={forwardedRef}
    >
      <Grid
        container
        rowSpacing={1}
        columnSpacing={{ xs: 1, sm: 1, md: 1 }}
      >
        {qrCodes}
      </Grid>
    </Box>
  )
}
