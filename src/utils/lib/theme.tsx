import {createTheme} from '@mui/material/styles';

const theme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: #FE645E,
            light: #FE645E, //It is the same but will put it here for maintanance purposes,
            contrastText: #ffffff,
            dark: #CD3C37,
        },
        secondary: {
            main: #0A1047,
            light: #141E7A
        },
        error: {
            main: #FE645E,
            
        },
        background: {
            default: #ffffff,
            paper: #fafafa //#fafafa is used as a background for some cards
        },
        text: {
            primary: #000000, //Sometimes #1E2832 is the primary and sometimes #000000 is.
            secondary: #5C5C5C,
            disabled: #8C9196
            
        }
    },
  
});

//#292D32 another color used for some icons
//#E7EBEF for selected state on shoe size option
// #F3F3F3 is the right place for this. It is the bg color for modals
//#494949 for label and input outline
//#fafafa is used as a background for some cards