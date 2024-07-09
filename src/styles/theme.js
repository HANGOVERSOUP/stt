// src/styles/theme.js
import { createTheme } from '@mui/material/styles';
import { red } from '@mui/material/colors';

const theme = createTheme({
  palette: {
    primary: {
      main: '#556cd6',
      // main: '#000000',
    },
    secondary: {
      main: '#19857b',
      // main: '#1f1f1f',
    },
    error: {
      main: red.A400,
    },
  },
});

export default theme;
