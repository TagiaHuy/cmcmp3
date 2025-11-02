import { createTheme } from '@mui/material/styles';

const darkTheme = createTheme({
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
      default: '#121212',
    },
    mode: 'dark',
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
        h6TextColor: '#e0e0e0',
      },
      sidebarLeft: {
        background: '#434368ff',
        textColor: '#b1b1b1ff',
        iconColor: '#929292ff',
      },  sidebarRight: {
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

const lightTheme = createTheme({
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
    mode: 'light',
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
    background: '#f0f0f0',
    border: '#cccccc',
    hoverBorder: '#aaaaaa',
    focusedBorder: '#888888',
    text: '#333333',
    placeholder: '#999999',
    icon: '#888888',
  },
  header: {
    background: '#f8f8f8',
  },
  body: {
    background: '#ffffff',
  },
  footer: {
    background: '#f8f8f8',
    textColor: '#666666',
    fontSize: '0.875rem',
  },
  sidebarLeft: {
    background: '#f0f0f0',
    textColor: '#333333',
    iconColor: '#666666',
  },
  sidebarRight: {
    background: '#f8f8f8',
    textColor: '#333333',
    iconColor: '#666666',
  },
  highlightButton: {
    background: '#e0e0e0',
    textColor: '#333333',
    hoverBackground: '#d0d0d0',
    highlightButtonBackground: '#007bff',
    highlightButtonHoverBackground: '#0056b3',
    divider: '#cccccc',
  },
  Button: {
    background: '#e0e0e0',
    textColor: '#333333',
    hoverBackground: '#d0d0d0',
    highlightButtonBackground: '#007bff',
    highlightButtonHoverBackground: '#0056b3',
    divider: '#cccccc',
    iconColor: '#666666',
  },
  navigation: {
    iconColor: '#666666',
    backgroundColor: 'transparent',
  },
});

export { darkTheme, lightTheme };