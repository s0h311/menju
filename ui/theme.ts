import createTheme from '@mui/material/styles/createTheme'
import type { PaletteColorOptions } from '@mui/material/styles/createPalette'

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

declare module '@mui/lab/LoadingButton' {
  interface LoadingButtonPropsColorOverrides {
    accent: true
    bgColor: true
    textColor: true
  }
}

declare module '@mui/material/Checkbox' {
  interface CheckboxPropsColorOverrides {
    accent: true
    bgColor: true
    textColor: true
  }
}

declare module '@mui/material/TextField' {
  interface TextFieldPropsColorOverrides {
    accent: true
    bgColor: true
    textColor: true
  }
}

declare module '@mui/material/SvgIcon' {
  interface SvgIconPropsColorOverrides {
    accent: true
    bgColor: true
    textColor: true
  }
}

export const theme = createTheme({
  palette: {
    primary: {
      main: '#7eaa92',
    },
    secondary: {
      main: '#caddc3',
    },
    accent: {
      main: '#f7e987',
    },
    bgColor: {
      main: '#f4f4f4',
    },
    textColor: {
      main: '#445069',
    },
  },
})
