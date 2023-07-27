import { createTheme } from '@mui/material'
import { PaletteColorOptions } from '@mui/material/styles/createPalette'

declare module '@mui/material/styles' {
  interface Palette {
    accent: PaletteColorOptions
    bgColor: PaletteColorOptions
    textColor: PaletteColorOptions
  }
  interface PaletteOptions {
    accent: PaletteColorOptions
    bgColor: PaletteColorOptions
    textColor: PaletteColorOptions
  }
}

declare module '@mui/material/Button' {
  interface ButtonPropsColorOverrides {
    accent: true
    bgColor: true
    textColor: true
  }
}

export const theme = createTheme({
  palette: {
    primary: {
      main: '#efd976',
    },
    secondary: {
      main: '#f3ebc9',
    },
    accent: {
      main: '#5464a6',
    },
    bgColor: {
      main: '#fcfaf2',
    },
    textColor: {
      main: '#211d07',
    },
  },
})
