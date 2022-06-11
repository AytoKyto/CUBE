import React from "react";
import Layout from "../components/Layout/Layout";
import { TextField, Grid, Typography, Button } from "@mui/material";

export default function Chat({}) {
  return (
    <Layout title="Cube | Chat" withSidebar={false}>
      <Grid container flexDirection={"row"}>
        <Grid item xs={2} sx={{ borderRight: "1px solid red", height: "80vh" }}>
          <Typography>Conversations</Typography>
        </Grid>
        <Grid item xs={10}>
          <Grid
            container
            flexDirection={"column"}
            justifyContent="space-evenly"
            sx={{ pl: 4 }}
          >
            <Grid item sx={{ height: "10vh" }}>
              Infos - Nom de la conversation
            </Grid>
            <Grid item sx={{ height: "57vh" }}>
              <Typography>Messages</Typography>
            </Grid>
            <Grid item sx={{ display: "flex", justifyContent: "center", alignItems: "center", mb: 2}}>
              <TextField
                id="lastName"
                fullWidth
                label="Message"
                multiline
                variant="filled"
                sx={{
                  width: "90%",
                  mr: 2,
                  "& textarea": { minHeight: "5vh" },
                  minHeight: "10vh",
                }}
                //value=""
                onChange={() => console.log("type message")}
              />
                 <Button variant="borderBtn" size="small" color="primary">
              Envoyer
            </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Layout>
  );
}
