"use client";

import { createTheme } from "@mui/material/styles";

const worksansFont = 'var(--font-worksans), "Segoe UI", sans-serif';
const nunitosansFont = 'var(--font-nunitosans), "Segoe UI", sans-serif';


const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#FE645E",
      light: "#FFD7D6", 
      contrastText: "#ffffff",
      dark: "#CD3C37",
    },
    secondary: {
      main: "#0A1047",
      light: "#141E7A",
    },
    error: {
      main: "#FE645E",
    },
    background: {
      default: "#ffffff",
      paper: "#fafafa", //#fafafa is used as a background for some cards
    },
    text: {
      primary: "#000000", //Sometimes #1E2832 is the primary and sometimes #000000 is.
      secondary: "#5C5C5C",
      disabled: "#8C9196",
    },
    cartTextColor: {
      primary: "#1E2832",
      secondary: "#8C9196",
      error: "#EB5656",
    },
  },
  components: {
    MuiRating: {
      styleOverrides: {
        iconFilled: ({ theme }) => ({
          color: theme.palette.primary.main,
        }),
        icon: {
          marginRight: "12px",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: ({ theme }) => ({
          textTransform: "none",
          borderRadius: "8px",
          fontWeight: "500",
          [theme.breakpoints.down("md")]: {
            height: 40,
          },
          [theme.breakpoints.up("md")]: {
            height: 54,
          },
          fontSize: "15px",
        }),
        outlined: ({ theme }) => ({
          border: `1px solid ${theme.palette.primary.main}`,
        }),
        contained: {
          boxShadow: "none",
          "&:hover": {
            boxShadow: "none",
          },
        },
      },
      variants: [
        {
          props: { size: "extraLarge" },
          style: {
            height: "61px",
          },
        },
      ],
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          boxShadow: "none",
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: 8,
          "&.Mui-error .MuiOutlinedInput-notchedOutline": {
            borderColor: theme.palette.error.main,
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: theme.palette.error.main,
          },
          "&.Mui-error input": {
            color: theme.palette.error.main,
            fontWeight: 500,
          },
        }),
        notchedOutline: {
          borderColor: "#494949",
        },
        input: {
          padding: "15px 16px",
          fontWeight: 300,
        },
      },
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          display: "flex",
          alignItems: "center",
          gap: 4,
          padding: 0,
          marginInline: 0,
          marginTop: 8,
          fontWeight: 400,
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          "&.Mui-focused": {
            borderColor: "#494949",
          },
        },
        filled: {
          borderColor: "#494949",
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          padding: 0,
          height: 19,
          "&.MuiCheckbox-sizeMedium": {
            width: 15,
            height: 15,
            "& svg": {
              fontSize: 15,
            },
          },
        },
      },
    },
    MuiSlider: {
      styleOverrides: {
        root: {
          padding: "6px 0",
        },
        rail: {
          backgroundColor: "#EAECF0",
        },
        thumb: {
          width: 16,
          height: 16,
          "&::before": {
            content: '""',
            margin: 0,
            width: 12,
            height: 12,
            backgroundColor: "#fff",
            borderRadius: "50%",
            top: 8,
            transform: "translateY(-50%)",
          },
          "&:hover, &.Mui-focusVisible, &.Mui-active": {
            boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.15)", // same as base shadow
          },
        },
      },
    },
  },
  typography: {
    fontFamily: worksansFont,
    h1: {
      fontFamily: worksansFont,
      fontSize: 53,
    },
    h2: {
      fontFamily: worksansFont,
      fontSize: 45,
      fontWeight: 500
    },
    h3: {
      fontFamily: worksansFont,
      fontSize: 30,
      fontWeight: 500
    },
    h4: {
      fontFamily: worksansFont,
      fontSize: 24,
    },
    h5: {
      fontFamily: worksansFont,
      fontSize: 23,
    },
    h6: {
      fontFamily: worksansFont,
      fontSize: 22,
    },
    subtitle1: {
      fontFamily: worksansFont,
      fontSize: 20,
    },
    subtitle2: {
      fontFamily: worksansFont,
      fontSize: 18,
    },
    body1: {
      fontFamily: worksansFont,
      fontSize: 16,
    },
    /* Input label, placeholder, option button, */
    body2: {
      fontFamily: worksansFont,
      fontSize: 15,
      fontWeight: 300,
    },
    button: {
      fontFamily: worksansFont,
      fontSize: 19, //For some buttons 16px, for AI button 12px
    },
    caption: {
      fontFamily: worksansFont,
      fontSize: 12,
    },
    cartText: {
      fontFamily: nunitosansFont,
      // fontSize: 14,
      fontWeight: 700,
      lineHeight: "24px",
    },
  },
});

//#292D32 another color used for some icons
//#E7EBEF for selected state on shoe size option
// #F3F3F3 is the right place for this. It is the bg color for modals
//#494949 for label and input outline
//#fafafa is used as a background for some cards
//Cart elements are the only ones that have nunito font so we should make a custom typo for those components only
//Thank you page needs custom as well

export default theme;
