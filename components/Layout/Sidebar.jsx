import React, { useContext } from "react";
import { Box, ListItem, Button, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useRouter } from "next/router";
import SettingsIcon from "@mui/icons-material/Settings";
import Link from "next/link";
import AuthContext from "../../context/authContext";

export default function Sidebar() {
  const { isAuthenticated, signOut, role } = useContext(AuthContext);
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleDisconnexion = () => {
    signOut();
    return router.push("/home");
  };

  return (
    <Box
      sx={{
        mt: "126px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        width: isMobile ? "100vw" : "20vw",
      }}
    >
      {isAuthenticated && (
        <Box sx={{ p: 2 }}>
          <Link href="/">
            <ListItem sx={{ borderBottom: `1px solid ${"gov.blue"}` }}>
              <Button variant="textBtn">Accueil</Button>
            </ListItem>
          </Link>
          <Link href="/resource/add">
            <ListItem>
              <Button variant="textBtn">Créer une ressource</Button>
            </ListItem>
          </Link>
          <Link href="/profile">
            <ListItem>
              <Button variant="textBtn">Mon profil</Button>
            </ListItem>
          </Link>
          <Link href="/chat">
            <ListItem>
              <Button variant="textBtn">Mes conversations</Button>
            </ListItem>
          </Link>
          <Link href="/admin">
            <ListItem>
              {(role === "admin" || role === "moderateur") && (
                <Button variant="textBtn" sx={{ color: "gov.red" }}>
                  Administration
                </Button>
              )}
            </ListItem>
          </Link>
        </Box>
      )}
      <Box sx={{ p: 2 }}>
        {isAuthenticated ? (
          <Button
            variant="borderBtn"
            color="primary"
            startIcon={<SettingsIcon />}
            onClick={handleDisconnexion}
          >
            Se déconnecter
          </Button>
        ) : (
          <Button
            variant="borderBtn"
            size="small"
            color="primary"
            startIcon={<SettingsIcon />}
            onClick={() => router.push("/login")}
          >
            Se connecter
          </Button>
        )}
      </Box>
    </Box>
  );
}
