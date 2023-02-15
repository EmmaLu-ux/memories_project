import React, { useState, useRef } from "react";
import { Button, Typography, TextField } from "@material-ui/core";
import { useDispatch } from "react-redux";

import useStyles from "./styles";
import { commentPost } from '../../actions/posts'

const CommentSection = ({ post }) => {
  const classes = useStyles();
  const [comments, setComments] = useState([post?.comments]);
  const [comment, setComment] = useState("");
  //   console.log('post', post)
  const dispatch = useDispatch()
  const user = JSON.parse(sessionStorage.getItem('profile'))
  const commentsRef = useRef()

  const handleClick = async () => {
    const finalComment = `${user?.result?.name}:${comment}`
    const newComments = await dispatch(commentPost(finalComment, post._id))
    setComments(newComments)
    setComment('')
    commentsRef.current.scrollIntoView({ behavior: 'smooth' })
  };
  return (
    <div>
      <div className={classes.commentsOuterContainer}>
        <div className={classes.commentsInnerContainer}>
          <Typography gutterBottom variant="h6">评论</Typography>
          {comments.map((c, i) => (
            <Typography key={i} gutterBottom variant="subtitle1">
              {c}
              {/* <strong>{c.split(': ')[0]}</strong>
              {c.split(':')[1]} */}
            </Typography>
          ))}
          <div ref={commentsRef} />
        </div>
        {user?.result?.name && (
          <div style={{ width: "70%" }}>
            <Typography gutterBottom variant="h6">评论:</Typography>
            <TextField
              fullWidth
              maxRows={4}
              minRows={4}
              multiline
              variant="outlined"
              label="评论"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <Button
              style={{ marginTop: "10px" }}
              fullWidth
              disabled={!comment}
              variant="contained"
              color="primary"
              onClick={handleClick}
            >发布评论</Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentSection;
