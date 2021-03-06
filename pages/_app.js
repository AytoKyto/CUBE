import React from "react";
import { ThemeProvider } from "@mui/material/styles";
import "../styles/globals.css";
import PropTypes from "prop-types";
// Provider qui gère l'authentification -- Refetch interval determine la duree de validite du token
import AuthProvider from "./../context/authProvider";
import theme from "../theme";

function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider refetchInterval={"1d"}>
        <Component {...pageProps} />
      </AuthProvider>
    </ThemeProvider>
  );
}

MyApp.propTypes = {
  Component: PropTypes.func.isRequired,
  pageProps: PropTypes.object.isRequired,
};

export default MyApp;
