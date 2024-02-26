import createTheme from '@mui/material/styles/createTheme'
import type { PaletteColorOptions } from '@mui/material/styles/createPalette'
import { useRestaurant } from '@/hooks/useRestaurant'

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

export const useCustomTheme = () => {
  const { colors } = useRestaurant()
  return createTheme({
    palette: {
      primary: {
        main: colors ? colors.primary : '#7eaa92',
      },
      secondary: {
        main: colors ? colors.secondary : '#caddc3',
      },
      accent: {
        main: colors ? colors.accent : '#f7e987',
      },
      bgColor: {
        main: '#f4f4f4',
      },
      textColor: {
        main: colors ? colors.textColor : '#445069',
      },
    },
  })
}
