import "@mui/material/styles"; // Necesario para extender interfaces existentes

declare module "@mui/material/styles" {
  interface Palette {
    // Declaramos 'cartTextColor' como un objeto
    cartTextColor: {
      primary: string;
      secondary: string;
      error: string;
    };
  }

  interface PaletteOptions {
    // Aquí la hacemos opcional para la creación del tema
    cartTextColor?: {
      primary: string;
      secondary: string;
      error: string;
    };
  }
}

declare module "@mui/material/styles" {
  interface TypographyVariants {
    cartText: React.CSSProperties;
  }

  interface TypographyVariantsOptions {
    cartText?: React.CSSProperties;
  }
}

declare module "@mui/material/Typography" {
  interface TypographyPropsVariantOverrides {
    cartText: true;
  }
}
