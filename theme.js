import { createTheme } from "@mui/material/styles";
import MarianneWoff from "./fonts/Marianne/Marianne-Regular.woff";
import SpectralWoff from "./fonts/Spectral/Spectral-Regular.woff";
import { frFR } from "@mui/material/locale";

const marianne = {
  fontFamily: "Marianne",
  fontStyle: "normal",
  fontDisplay: "swap",
  fontWeight: 400,
  src: `
    local('Marianne'),
    local('Marianne-Regular'),
    url(${MarianneWoff}) format('woff')
  `,
};

const spectral = {
  fontFamily: "Spectral",
  fontStyle: "normal",
  fontDisplay: "swap",
  fontWeight: 400,
  src: `
    local('Spectral'),
    local('Spectral-Regular'),
    url(${SpectralWoff}) format('woff')
  `,
};

const theme = createTheme(
  {
    palette: {
      gov: {
        blue: "#000091",
        white: "#FFFFFF",
        red: "#E1000F",
        lightEcume: "#869ECE",
        mediumEcume: "#465F9D",
        mediumCumulus: "#7AB18E",
        lightCumulus: "#417DC4",
        darkCumulus: "#3558A2",
        mediumMenthe: "#009081",
        lightMenthe: "#21ABBE",
        darkMenthe: "#37635F",
        mediumTuile: "#CE614A",
        lightTuile: "#FF9575",
        darkTuile: "#AD4847",
        mediumGlycine: "#A558A0",
      },
      secondary: {
        main: "#EEEEEE",
      },
    },
    typography: {
      useNextVariants: true,
      fontFamily: ["Marianne", "Arial", "sans-serif"].join(","),
    },
    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundColor: "#F9F8F6",
            boxShadow: "0px 0px 0px 0px rgba(0,0,0,0.2)",
            borderRadius: "0px",
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            "@font-face": [marianne],
            fontFamily: "Marianne, Arial, sans-serif",
          },
        },
        variants: [
          {
            props: { variant: "bleuBtn" },
            style: {
              backgroundColor: "#000091",
              color: "#FFFFFF",
              textTransform: "capitalize",
              borderRadius: "0px",
              boxShadow: "0px 0px 0px 0px rgba(0,0,0,0.2)",
              padding: "0.3rem 1.3rem 0.3rem 1.3rem",
              border: "1px solid #000091",
              ":hover": {
                backgroundColor: "transparent",
                border: "1px solid #000091",
                color: "#000091",
              },
              ":disabled": {
                backgroundColor: "lightgrey",
                border: "1px solid lightgrey",
              },
            },
          },
          {
            props: { variant: "redBtn" },
            style: {
              backgroundColor: "#E1000F",
              color: "#FFFFFF",
              textTransform: "capitalize",
              borderRadius: "0px",
              boxShadow: "0px 0px 0px 0px rgba(0,0,0,0.2)",
              padding: "0.3rem 1.3rem 0.3rem 1.3rem",
              border: "1px solid #E1000F",
              ":hover": {
                backgroundColor: "transparent",
                border: "1px solid #E1000F",
                color: "#E1000F",
              },
              ":disabled": {
                backgroundColor: "lightgrey",
                border: "1px solid lightgrey",
              },
            },
          },
          {
            props: { variant: "textBtn" },
            style: {
              backgroundColor: "transparent",
              color: "#000091",
              textTransform: "capitalize",
              borderRadius: "0px",
              boxShadow: "0px 0px 0px 0px rgba(0,0,0,0.2)",
              padding: "0.5rem",
              ":hover": {
                backgroundColor: "#000091",
                color: "#FFFFFF",
              },
            },
          },
          {
            props: { variant: "borderBtn" },
            style: {
              backgroundColor: "transparent",
              border: "1px solid #000091",
              textTransform: "capitalize",
              color: "#000091",
              boxShadow: "0px 0px 0px 0px rgba(0,0,0,0.2)",
              padding: "0.3rem 0.5rem 0.3rem 0.5rem",
              borderRadius: "0px",
              ":hover": {
                backgroundColor: "#000091",
                border: "1px solid #000091",
                color: "#FFFFFF",
                fill: "#FFFFFF",
              },
            },
          },
        ],
      },
      MuiChip: {
        styleOverrides: {
          root: {
            "@font-face": [marianne],
            fontFamily: "Marianne, Arial, sans-serif",
            backgroundColor: "#417DC4",
            color: "white",
          },
        },
      },
      MuiTypography: {
        styleOverrides: {
          root: {
            "@font-face": [marianne],
            fontFamily: "Marianne, Arial, sans-serif",
            fontStyle: "normal",
            fontWeight: "normal",
          },
        },
        variants: [
          {
            props: { variant: "h1" },
            style: {
              fontSize: "32px",
              lineHeight: "40px",
              marginBottom: "24px",
            },
          },
          {
            props: { variant: "h2" },
            style: {
              fontSize: "28px",
              lineHeight: "36px",
              marginBottom: "24px",
            },
          },
          {
            props: { variant: "h3" },
            style: {
              fontSize: "24px",
              lineHeight: "32px",
              marginBottom: "24px",
            },
          },
          {
            props: { variant: "h4" },
            style: {
              fontSize: "22px",
              lineHeight: "28px",
              marginBottom: "24px",
            },
          },
          {
            props: { variant: "categoryTypo" },
            style: {
              fontSize: "12px",
              lineHeight: "20px",
              color: "#666666",
            },
          },
          {
            props: { variant: "TitreCard" },
            style: {
              fontWeight: "bold",
              fontSize: "20px",
              lineHeight: "28px",
              color: "black",
            },
          },
          {
            props: { variant: "DesCard" },
            style: {
              fontSize: "13px",
              //lineHeight: "16px",
              color: "black",
            },
          },
          {
            props: { variant: "TitreSelect" },
            style: {
              fontSize: "16px",
              lineHeight: "20px",
            },
          },
        ],
      },
      MuiCardContent: {
        styleOverrides: {
          root: {
            "&:last-child": {
              paddingBottom: 0,
            },
          },
        },
      },
      MuiCardMedia: {
        variants: [
          {
            props: { variant: "imageCard" },
            style: {
              width: "100%",
              height: "100%",
            },
          },
        ],
      },
      MuiFormControl: {
        variants: [
          {
            props: { variant: "filled" },
            style: {
              width: "300px",
              height: "50px",
              borderBottom: "2px solid #3A3A3A",
            },
          },
        ],
      },
      MuiAppBar: {
        variants: [
          {
            props: { variant: "header" },
            style: {
              backgroundColor: "white",
              color: "black",
              width: "100vw",
              height: "126px",
              paddingTop: "1%",
              paddingBottom: "1%",
              paddingLeft: "100px",
              paddingRight: "100px",
              boxShadow:
                "0px 16px 16px -16px rgba(0, 0, 0, 0.32), 0px 8px 16px rgba(0, 0, 0, 0.1)",
            },
          },
        ],
      },
      MuiAlert: {
        styleOverrides: {
          // Name of the slot
          standardSuccess: {
            backgroundColor: "#21ABBE",
            "& svg": {
              color: "white",
            },
          },
          standardError: {
            backgroundColor: "#FFB7AE",
            color: "#8D533E",
            "& svg": {
              color: "#E1000F",
            },
          },
        },
      },
      MuiSearch: {
        variants: [
          {
            props: { variant: "searchHeader" },
            style: {
              display: "flex",
              flexDirection: "row-reverse",
              alignItems: "center",
            },
          },
        ],
      },
      MuiInputBase: {
        styleOverrides: {
          root: {
            "@font-face": [marianne],
            fontFamily: "Marianne, Arial, sans-serif",
          },
        },
        variants: [
          {
            props: { variant: "searchHeader" },
            style: {
              backgroundColor: "red",
              borderRadius: "0px",
              border: "1px solid #3A3A3A",
            },
          },
        ],
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            "@font-face": [marianne],
            fontFamily: "Marianne, Arial, sans-serif",
          },
        },
        variants: [
          {
            props: { variant: "filled" },
            style: {
              borderRadius: "0px",
              "&.MuiInputBase-root::after": {
                border: "1px solid transparent",
                transform: "none",
              },
            },
          },
        ],
      },
    },
  },
  frFR
);

export default theme;
