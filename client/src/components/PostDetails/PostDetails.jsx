import React, { useEffect } from 'react'
import { Paper, Typography, CircularProgress, Divider } from '@material-ui/core'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import moment from 'moment'

import useStyles from './styles'
import { getPost, getPostsBySearch } from '../../actions/posts'
import CommentSection from './CommentSection'

const PostDetails = () => {
  const classes = useStyles()
  const dispatch = useDispatch()
  const { post, posts, isLoading } = useSelector(state => state.posts)
  const navigate = useNavigate()
  const { id } = useParams()

  useEffect(() => {
    dispatch(getPost(id))
  }, [id])

  useEffect(() => {
    if(post){
      dispatch(getPostsBySearch({ search: '', tags: post?.tags.join(',')}))
    }
  }, [post])

  if(!post) return null

  if(isLoading){
    return <Paper elevation={6} className={classes.loadingPaper}>
      <CircularProgress size='7em'/>
    </Paper>
  }
  const recommendedPosts = posts.filter(({_id}) => _id !== post._id)

  const openPost = (_id) => navigate(`/posts/${_id}`)
  return (
    <Paper style={{ padding: '20px', borderRadius: '15px' }} elevation={6}>
      <div className={classes.card}>
        <div className={classes.section}>
          <Typography variant="h3" component="h2">{post.title}</Typography>
          <Typography gutterBottom variant="h6" color="textSecondary" component="h2">{post.tags.map((tag) => `#${tag} `)}</Typography>
          <Typography gutterBottom variant="body1" component="p">{post.message}</Typography>
          <Typography variant="h6">Created by: {post.name}</Typography>
          <Typography variant="body1">{moment(post.createdAt).fromNow()}</Typography>
          <Divider style={{ margin: '20px 0' }} />
          <Typography variant="body1"><strong>Realtime Chat - coming soon!</strong></Typography>
          <Divider style={{ margin: '20px 0' }} />
          {/* <Typography variant="body1"><strong>Comments - coming soon!</strong></Typography> */}
          <CommentSection post={post}/>
          <Divider style={{ margin: '20px 0' }} />
        </div>
        <div className={classes.imageSection} >
          <img className={classes.media} src={post.selectedFile || ''} alt={post.title} />
        </div>
      </div>
      {recommendedPosts?.length && (
        <div className={classes.section}>
          <Typography variant='h5' gutterBottom>?????????????????????</Typography>
          <Divider />
          <div className={classes.recommendedposts}>
            {recommendedPosts?.map(({ title, name, message, selectedFile, likes, _id }, i) => (
              <div style={{ margin: '20px', cursor: 'pointer' }} onClick={() => openPost(_id)} key={i}>
                <Typography variant='h6' gutterBottom>{title}</Typography>
                <Typography variant='subtitle2' gutterBottom>{name}</Typography>
                <Typography variant='subtitle2' gutterBottom>{message}</Typography>
                <Typography variant='subtitle1'>?????????{likes.length}</Typography>
                <img src={selectedFile} width='200px'/>
              </div>
            ))}
          </div>
        </div>
      )}
    </Paper>
  )
}

export default PostDetails