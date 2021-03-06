import Typography from "@mui/material/Typography";
import { Button, Grid, OutlinedInput, TextareaAutosize } from "@mui/material";
import React, { useContext, useState } from "react";
import styles from "../../styles/CommentForm.module.css";
import AuthContext from "../../context/authContext";
import apiService from "../../services/apiService";
import { useRouter } from "next/router";

export default function CommentForm(resourceId) {
  const { isAuthenticated, token } = useContext(AuthContext);
  const router = useRouter();
  const [newComment, setNewComment] = useState({
    title: "",
    value: "",
  });
  // const [fields, setFields] = useState({ comment: "" });
  let placeHolderText = "Laissez votre commentaire..";
  if (!isAuthenticated) {
    placeHolderText = "Veuillez vous connecter pour laisser un commentaire";
  }

  const isCommentFormValid = () => {
    const { title, value } = newComment;
    return isAuthenticated && title !== "" && value !== "";
  };

  const submitComment = async () => {
    if (isAuthenticated) {
      const comment = {
        title: document.getElementById("commentTitle").value,
        value: document.getElementById("commentTextArea").value,
        relatedResource: resourceId.resourceId.toString(),
      };
      //call the api' create item
      try {
        let postReq = await apiService.createItem("comments", comment, token);
        if (postReq.status === 201) {
          console.log(postReq);
          console.log(postReq.data);
        }
      } catch (e) {
        console.log("Error in try of submitComment - CommentForm");
        console.log(e);
      }
      router.reload();
    }
  };
  return (
    <Grid
      className={styles.grid}
      container
      sx={{ mt: 2 }}
      flexDirection="column"
    >
      <Typography variant="h6">Poster un commentaire</Typography>
      <OutlinedInput
        id="commentTitle"
        placeholder="Titre"
        onChange={(titleEvent) =>
          setNewComment({ ...newComment, title: titleEvent.target.value })
        }
        sx={{ mt: 2, mb: 1 }}
        disabled={!isAuthenticated}
      />
      <TextareaAutosize
        id="commentTextArea"
        className={styles.textArea}
        aria-label="Laisser un commentaire"
        minRows={3}
        placeholder={placeHolderText}
        onChange={(valueEvent) =>
          setNewComment({
            ...newComment,
            value: valueEvent.target.value,
          })
        }
        disabled={!isAuthenticated}
      />
      <Grid sx={{ mt: 1 }}>
        <Button
          onClick={submitComment}
          variant="bleuBtn"
          disabled={!isCommentFormValid()}
        >
          Envoyer
        </Button>
      </Grid>
    </Grid>
  );
}
