import "@mui/material/Button";
import "@mui/material/styles";

declare module "@mui/material/Button" {
  interface ButtonPropsSizeOverrides {
    extraLarge: true;
  }
}

declare module "@mui/material/styles" {
  interface Palette {
    cartTextColor: {
      primary: string;
      secondary: string;
      error: string;
    };
  }

  interface PaletteOptions {
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
