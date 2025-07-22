import '@mui/material/styles'

declare module '@mui/material/styles' {
  interface Palette {
    custom: {
      darkGrey: string
    }
  }

  interface PaletteOptions {
    custom?: {
      darkGrey?: string
    }
  }
}
