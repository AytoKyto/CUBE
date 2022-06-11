import React from "react";
import Layout from "../components/Layout/Layout";
import { TextField, Grid, Typography } from "@mui/material";

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
            <Grid item sx={{ height: "60vh" }}>
              <Typography>Messages</Typography>
            </Grid>
            <Grid item>
              <TextField
                id="lastName"
                fullWidth
                label="Message"
                multiline
                variant="filled"
                sx={{
                  width: "100%",
                  "& textarea": { minHeight: "5vh" },
                  minHeight: "10vh",
                }}
                //value=""
                onChange={() => console.log("type message")}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Layout>
  );
}
