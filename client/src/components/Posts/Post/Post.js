import React, { useState } from 'react'
import { Card, CardActions, CardContent, CardMedia, Button, Typography, ButtonBase } from '@material-ui/core'
import { ThumbUpAlt, Delete, MoreHoriz, ThumbUpAltOutlined } from '@material-ui/icons'
import moment from 'moment'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import useStyles from './styles'
import { deletePost, likePost } from '../../../actions/posts'

const Post = ({ post, setCurrentId }) => {
  const classes = useStyles()
  const dispatch = useDispatch()
  const user = JSON.parse(sessionStorage.getItem('profile'))
  const navigate = useNavigate()
  const [likes, setLikes] = useState(post?.likes)
  const userId = user?.result?.sub || user?.result?._id
  const hasLikedPost = post.likes.find(like => like === userId)

  const handleLike = async () => {
    dispatch(likePost(post._id))
    if(hasLikedPost){ // 已经点赞过了，再点就是取消点赞
      setLikes(post.likes.filter(id => id !== userId))
    }else{ // 现在点赞，把该用户的id存进likes中
      setLikes([...post.likes, userId])
    }
  }
  const Likes = () => {
    if (likes.length > 0) {
      return likes.find(like => like === userId)
        ? (<><ThumbUpAlt fontSize="small" />
          &nbsp;{likes.length > 2 ? `您和其他${likes.length - 1}人` : `${likes.length}人喜欢`}</>
        ) : (
          <><ThumbUpAltOutlined fontSize="small" />&nbsp;{likes.length}人喜欢</>
        );
    }
    return <><ThumbUpAltOutlined fontSize="small" />&nbsp;喜欢</>;
  };

  const openPost = () => navigate(`/posts/${post._id}`)
  

  return (
    <Card className={classes.card} raised elevation={6}>
      {/* <ButtonBase className={classes.cardAction} onClick={openPost}> */}
        <CardMedia component='div' className={classes.media} image={post.selectedFile || ''} title={post.title} onClick={openPost} style={{ cursor: 'pointer'}}/>
        <div className={classes.overlay}>
          <Typography variant='h6'>{post.name}</Typography>
          <Typography variant='body2'>{moment(post.createdAt).fromNow()}</Typography>
        </div>
        {(user?.result?.sub === post?.creator || user?.result?._id === post?.creator) ? (
          <div className={classes.overlay2}>
            <Button style={{ color: 'white' }} size='small'
              onClick={() => setCurrentId(post._id)}>
              <MoreHoriz fontSize='medium' />
            </Button>
          </div>
        ) : null }

        <div className={classes.details}>
          <Typography variant='body2' color='textSecondary' gutterBottom>{post.tags.map(tag => `#${tag} `)}</Typography>
        </div>
        <Typography className={classes.title} variant='h5' gutterBottom>{post.title}</Typography>
        <CardContent>
          <Typography variant='body2' color='textSecondary' gutterBottom>{post.message}</Typography>
        </CardContent>
      {/* </ButtonBase> */}
      <CardActions className={classes.cardActions}>
        <Button size='small' color='primary'
          disabled={!user?.result}
          onClick={handleLike}>
          {/* <ThumbUpAlt fontSize='small'/>
          喜欢 &nbsp;
          {post.likeCount} */}
          <Likes />
        </Button>
        {(user?.result?.sub === post?.creator || user?.result?._id === post?.creator) ? (
          <Button size='small' color='primary'
            onClick={() => dispatch(deletePost(post._id))}>
            <Delete fontSize='small' />
            删除
          </Button>
        ) : null }
      </CardActions>
    </Card>
  )
}

export default Post