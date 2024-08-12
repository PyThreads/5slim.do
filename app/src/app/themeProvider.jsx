"use client"

import { createTheme, ThemeProvider } from "@mui/material";
import { Roboto } from 'next/font/google'

let theme = createTheme({
  typography: {
    variants: {
      navBarItem: {
        // Define los estilos de tu variante personalizada
        // Por ejemplo:
        fontFamily: 'Arial',
        fontWeight: 600,
        fontSize: '16px',
        // Otros estilos...
      },
    },
  },
  components: {
    MuiPaginationItem: {
      styleOverrides: {
        root: {
          color: '#FF6633', // Color mamey
          fontWeight: "bold",
          '&:hover': {
            backgroundColor: '#FF6633', // Cambia el color de fondo al pasar el ratón sobre la página
            color: '#ffffff', // Cambia el color del texto al pasar el ratón sobre la página
          },
          '&.Mui-selected': {
            backgroundColor: '#FF6633', // Cambia el color de fondo de la página seleccionada
            color: '#ffffff', // Cambia el color del texto de la página seleccionada
            '&:hover': {
              backgroundColor: '#FF6633', // Mantén el color de fondo al pasar el ratón sobre la página seleccionada
            },
          },
        },
      },
    },
  }
});


// If loading a variable font, you don't need to specify the font weight
const roboto = Roboto({
  subsets: ['latin'],
  display: 'swap',
  weight: "500"
})

const baseFont = {
  fontFamily: roboto.style.fontFamily,
  color: "black",
  fontStyle: "normal",
}

theme.typography.h1 = {
  ...baseFont,
  '@media (min-width:600px)': {
    fontSize: '1.5rem',
    lineHeight: "default"
  },
  [theme.breakpoints.up('md')]: {
    fontSize: '3.0rem',
  },
};
theme.typography.h2 = { ...theme.typography.h2, ...baseFont };
theme.typography.h3 = { ...theme.typography.h3, ...baseFont };
theme.typography.h4 = {
  ...theme.typography.h4,
  ...baseFont,
  fontWeight: "bold"
};
theme.typography.h5 = { ...theme.typography.h5, ...baseFont };
theme.typography.h6 = { ...theme.typography.h6, ...baseFont,fontSize:20 };

theme.typography.menuItem = {
  fontFamily: roboto.style.fontFamily,
  color: "#474e6e"
}

const ThemeProv = ({ children }) => {

  return (
    <ThemeProvider theme={theme}>
      {children}
    </ThemeProvider>
  )
}

export default ThemeProv