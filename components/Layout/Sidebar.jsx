import * as React from "react";
import { Box, Grid, ListItem, ListItemText, Button } from "@mui/material";
import Link from "next/link";
import SettingsIcon from "@mui/icons-material/Settings";
import HomeIcon from "@mui/icons-material/Home";

export default function Sidebar() {
  return (
    <Box
      sx={{
        height: "calc(100vh-126)",
        position: "fixed",
        top: 126,
        left: 0,
        backgroundColor: "transparent",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Box sx={{ paddingTop: "190px", width: "80%" }}>
        <ListItem>
          <HomeIcon sx={{ marginRight: "20px" }} color="primary" />
          <ListItemText primary="Item 1" />
        </ListItem>
        <ListItem>
          <ListItemText primary="Item 2" />
        </ListItem>
        <ListItem>
          <ListItemText primary="Item 3" />
        </ListItem>
        <ListItem>
          <Link href="/login">
            <a>
              <ListItemText primary="Se connecter" />
            </a>
          </Link>
        </ListItem>
      </Box>
      <Box sx={{ marginBottom: "100px" }}>
        <Button
          variant="borderBtn"
          size="small"
          color="primary"
          startIcon={<SettingsIcon />}
        >
          Paramètres
        </Button>
      </Box>
    </Box>
  );
}
