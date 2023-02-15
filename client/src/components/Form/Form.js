import React, { useState, useEffect } from 'react'
import { TextField, Button, Typography, Paper } from '@material-ui/core'
import FileBase from 'react-file-base64'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import useStyles from './styles'
import { createPost, updatePost } from '../../actions/posts'

const Form = ({ currentId, setCurrentId }) => {
  const classes = useStyles()
  const [postData, setPostData] = useState({
    title: '', tags: '', selectedFile: '', message: ''
  })
  const dispatch = useDispatch()
  const post = useSelector(state => currentId ? state.posts.posts.find(post => post._id === currentId) : null)
  const user = JSON.parse(sessionStorage.getItem('profile'))
  const navigate = useNavigate()

  useEffect(() => {
    if(post) setPostData(post)
  }, [post])

  const clear = () => {
    setCurrentId(null)
    setPostData({ title: '', tags: '', selectedFile: '', message: '' })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // console.log('postData:', postData)
    if(!currentId){
      dispatch(createPost({ ...postData, name: user?.result?.name }, navigate))
    }else{
      dispatch(updatePost(currentId, { ...postData, name: user?.result?.name}))
    }
    clear()
  }
  
  if(!user?.result?.name){
    return (
      <Paper className={classes.paper} elevation={6}>
        <Typography variant='h6' align='center'>
          请登录账户以创建您自己的碎片记忆或点赞他人的碎片记忆
        </Typography>
      </Paper>
    )
  }

  return (
    <Paper className={classes.paper} elevation={6}>
      <form autoComplete='off' noValidate className={`${classes.root} ${classes.form}`} onSubmit={handleSubmit}>
        <Typography variant='h6'>{ currentId ? '修改' : '创建' }一个Memory</Typography>
        {/* <TextField name='creator' variant='outlined' label='创建者' fullWidth value={postData.creator} onChange={e => setPostData({ ...postData, creator: e.target.value })} /> */}
        <TextField name='title' variant='outlined' label='标题' fullWidth value={postData.title} onChange={e => setPostData({ ...postData, title: e.target.value })} />
        <TextField multiline maxRows={10} minRows={4} name='message' variant='outlined' label='内容' fullWidth value={postData.message} onChange={e => setPostData({ ...postData, message: e.target.value })} />
        <TextField name='tags' variant='outlined' label='标签(英文逗号隔开)' fullWidth value={postData.tags} onChange={e => setPostData({ ...postData, tags: e.target.value.split(',') })} />
        <div className={classes.fileInput}>
          <FileBase type='file' multiple={false} onDone={({ base64 }) => setPostData({ ...postData, selectedFile: base64 })} />
        </div>
        <Button className={classes.buttonSubmit} variant='contained' color='primary' size='large' type='submit' fullWidth>提交</Button>
        <Button variant='contained' color='secondary' size='small' onClick={clear} fullWidth>清除</Button>
      </form>
    </Paper>
  )
}

export default Form