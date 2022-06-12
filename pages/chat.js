import React, { useState, useEffect, useRef, useContext } from "react";
import AuthContext from "../context/authContext";
import SocketIOClient from "socket.io-client";
import Layout from "../components/Layout/Layout";
import {
  Grid,
  Typography,
  Button,
  Badge,
  Avatar,
  Stack,
  TextField,
} from "@mui/material";

export default function Chat({}) {
  const { session, fetchProfile, isAuthenticated, token } =
    useContext(AuthContext);
  const [user, setUser] = useState({});
  const [conversations, setConversations] = useState([]);
  const [avatar, setAvatar] = useState("");
  const inputRef = useRef(null);
  const [chat, setChat] = useState([]);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const getProfile = async () => {
      try {
        const user = await fetchProfile(token);
        console.log(user);
        setUser(`${user?.firstName} ${user?.lastName}`);
        setAvatar(`${user?.profilePic}`);
        setConversations(user.conversations);
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
      <Grid container flexDirection={"row"} maxHeight="80vh">
        <Grid item xs={2}>
          <Grid
            container
            flexDirection="column"
            height={"80vh"}
            sx={{ backgroundColor: "white" }}
          >
            <Grid
              item
              sx={{
                minHeight: "10vh",
                flexDirection: "column",
                justifyContent: "center",
                display: "flex",
                alignItems: "center",
                backgroundColor: `rgba(65, 95, 157, 0.15)`,
              }}
            >
              <Typography>Conversations</Typography>
            </Grid>
            <Stack
              justifyContent={
                conversations.length === 0 ? "center" : "flex-start"
              }
              alignItems={conversations.length === 0 ? "center" : "flex-start"}
              sx={{ height: "60vh", mb: "10vh" }}
            >
              {conversations.length === 0 && (
                <Typography>Aucune conversation</Typography>
              )}
            </Stack>
          </Grid>
        </Grid>
        <Grid item xs={10}>
          <Grid container flexDirection={"column"} height={"80vh"}>
            <Grid
              item
              sx={{
                minHeight: "10vh",
                backgroundColor: "gov.blue",
                display: "flex",
                alignItems: "center",
              }}
            >
              <Typography variant="h6" sx={{ ml: 2, color: "gov.white" }}>
                Nom de la conversation
              </Typography>
            </Grid>
            <Grid
              item
              sx={{
                overflowY: "scroll",
                height: "60vh",
                mb: "10vh",
                display: "flex",
                flexDirection: "column",
                justifyContent: chat.length === 0 ? "center" : "flex-start",
                alignItems: chat.length === 0 ? "center" : "flex-start",
              }}
            >
              {chat.length === 0 && <Typography>Aucun Message</Typography>}
              {chat.map((chat, i) => (
                <Stack
                  key={"msg_" + i}
                  direction="row"
                  alignItems="start"
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
                    <Avatar alt={chat.user} src={`${avatar}`} />
                  </Badge>
                  <Stack>
                    <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent="start"
                    >
                      <Typography
                        variant="subtitle2"
                        sx={{ ml: 1, color: "gray" }}
                      >
                        {user}
                      </Typography>
                      <Typography
                        variant="subtitle2"
                        sx={{ ml: 1, color: "gray" }}
                      >
                        -inserer date
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
                width: "80vw",
                position: "fixed",
                bottom: 0,
                backgroundColor: "white",
              }}
            >
              <TextField
                id="message"
                fullWidth
                multiline
                sx={{
                  width: "90%",
                  mr: 2,
                  "& textarea": { minHeight: "5vh" },
                  height: "10vh",
                  overflowY: "scroll",
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
