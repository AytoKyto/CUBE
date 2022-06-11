import React, { useState, useEffect, useRef, useContext } from "react";
import AuthContext from "../context/authContext";
import SocketIOClient from "socket.io-client";
import Layout from "../components/Layout/Layout";
import {
  TextField,
  Grid,
  Typography,
  Button,
  Badge,
  Avatar,
  Stack,
} from "@mui/material";

export default function Chat({}) {
  const { session, fetchProfile, isAuthenticated, token } =
    useContext(AuthContext);
  const [user, setUser] = useState({});
  const inputRef = useRef(null);
  const [chat, setChat] = useState([]);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const getProfile = async () => {
      try {
        const user = await fetchProfile(token);
        setUser(`${user?.firstName} ${user?.lastName}`);
      } catch (err) {}
    };

    const onLoad = async () => await getProfile();

    return onLoad();
  }, [session]);

  console.log("chat actuel", chat);

  useEffect(() => {
    // Branchement a la soquette
    const socket = SocketIOClient.connect(process.env.BASE_URL, {
      path: "/api/chat/socketio",
    });

    // Detec evt en console
    socket.on("connect", () => {
      console.log("SOQUETTE ON!", socket.id);
    });

    // Update chat
    socket.on("message", (message) => {
      console.log("message", message);
      chat.push(message);
      setChat([...chat]);
    });

    // Ferme la soquette au demontage
    if (socket) return () => socket.disconnect();
  }, []);

  // TODO A modifier pour passer en version persistence + multi convo
  const sendMessage = async () => {
    if (msg) {
      //! TODO - A modifier pour insertion en bdd
      const message = {
        user,
        msg,
      };

      // Envoi du message a tous les autres utilisateurs
      const resp = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(message),
      });

      // Remets le champ a 0 apres envoi
      if (resp.ok) setMsg("");
    }

    // Focus sur le champ de message
    inputRef?.current?.focus();
  };
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
              {chat.map((chat, i) => (
                <Stack
                  key={"msg_" + i}
                  direction="row"
                  alignItems="center"
                  sx={{ my: 2 }}
                >
                  <Badge
                    overlap="circular"
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                    variant="dot"
                    sx={{
                      "& .MuiBadge-badge": {
                        backgroundColor: isAuthenticated && "#21ABBE",
                        color: isAuthenticated && "#21ABBE",
                        boxShadow: isAuthenticated && `0 0 0 2px #21ABBE`,
                      },
                    }}
                  >
                    <Avatar
                      alt={`${user?.firstName}`}
                      src={`${user?.profilePic}`}
                    />
                  </Badge>
                  <Stack>
                    <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Typography variant="subtitle2" sx={{ ml: 1 }}>
                        {user} -
                      </Typography>
                      <Typography variant="subtitle2" sx={{ ml: 1 }}>
                        inserer date
                      </Typography>
                    </Stack>
                    <Typography variant="body2" sx={{ ml: 1 }}>
                      {chat.msg}
                    </Typography>
                  </Stack>
                </Stack>
              ))}
            </Grid>
            <Grid
              item
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                mb: 2,
              }}
            >
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
                value={msg}
                onChange={(e) => {
                  setMsg(e.target.value);
                }}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    sendMessage();
                  }
                }}
              />
              <Button
                variant="borderBtn"
                size="small"
                color="primary"
                onClick={() => sendMessage()}
              >
                Envoyer
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Layout>
  );
}
