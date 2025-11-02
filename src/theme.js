import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#556cd6',
    },
    secondary: {
      main: '#19857b',
    },
    error: {
      main: '#red',
    },
    background: {
      default: '#fff',
    },
    mode: 'light', // default mode
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    h1: {
      fontSize: '3rem',
      fontWeight: 600,
    },
    body1: {
      fontSize: '1rem',
    },
  },
  search: {
    background: '#333345',
    border: '#55556b',
    hoverBorder: '#77778c',
    focusedBorder: '#a0a0b0',
    text: '#e0e0e0',
    placeholder: '#a0a0a0',
    icon: '#a0a0b0',
  },
  header: {
    background: '#33335eff',
  },
  body: {
    background: '#1f1f35ff',
  },
  footer: {
    background: '#1f1f35ff',
    textColor: '#b1b1b1ff',
    fontSize: '0.875rem',
  },
  sidebarLeft: {
    background: '#434368ff',
    textColor: '#b1b1b1ff',
    iconColor: '#929292ff',
  },
  sidebarRight: {
    background: '#252542ff',
    textColor: '#b1b1b1ff',
    iconColor: '#929292ff',
  },
  highlightButton: {
    background: '#302644',
    textColor: '#e0e0e0',
    hoverBackground: '#443a57',
    highlightButtonBackground: '#9353FF',
    highlightButtonHoverBackground: '#7a42cc',
    divider: '#555577',
  },
  Button: {
    background: '#302644',
    textColor: '#e0e0e0',
    hoverBackground: '#443a57',
    highlightButtonBackground: '#9353FF',
    highlightButtonHoverBackground: '#7a42cc',
    divider: '#555577',
    iconColor: '#c2c2c2ff',
  },
  navigation: {
    iconColor: '#c2c2c2ff',
    backgroundColor: 'transparent',
  },
});

export default theme;