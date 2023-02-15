import React, { useState } from 'react'
import { Avatar, Button, Typography, Paper, Grid, Container } from '@material-ui/core'
import { LockOutlined } from '@material-ui/icons'
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google' // 实现谷歌第三方的登录
import jwtDecode from 'jwt-decode'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import useStyles from './styles'
import Input from './Input'
// import Icon from './Icon'
import { AUTH } from '../../constants/actionTypes'
import { signin, signup } from '../../actions/auth'

const initialState = { name: '', email: '', confirmPassword: '', password: '' }

const Auth = () => {
  const classes = useStyles()
  const [showPassword, setShowPassword] = useState(false)
  const [isSignUp, setIsSignUp] = useState(false)
  const [formData, setFormData] = useState(initialState)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  /* form提交数据 */
  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log(formData)
    if (isSignUp) {
      dispatch(signup(formData, navigate))
    } else {
      dispatch(signin(formData, navigate))
    }
  }

  const handleChange = (e) => {
    // console.log('handleChange')
    setFormData({ ...formData, [e.target.name]: e.target.value })
    // console.log('formData: ', formData)
  }
  const handleShowPassword = () => setShowPassword(preShowPassword => !preShowPassword)
  const switchMode = () => {
    setIsSignUp(prevIsSignUp => !prevIsSignUp)
    setShowPassword(false)
  }

  const googleSuccess = async (res) => {
    // console.log('google-login-success: ', res)
    const result = jwtDecode(res?.credential)
    const token = res?.credential
    // console.log(result)
    try {
      dispatch({ type: AUTH, playload: { result, token } })
      navigate('/', { replace: true })
    } catch (error) {
      console.log(error)
    }
  }
  const googleError = (error) => {
    console.log('google-login-error: ', error)
  }
  /* client-id: 511187713250-lau05uhtqlrq2hqfimct4m58umvrdmdr.apps.googleusercontent.com */
  /* client-password: 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 */
  return (
    <Container component='main' maxWidth='xs'> {/* <main> 标签用于指定文档的主体内容。 */}
      <Paper className={classes.paper} elevation={3}>
        <Avatar className={classes.avatar}>
          <LockOutlined />
        </Avatar>
        <Typography variant='h5'>{isSignUp ? '注册' : '登录'}</Typography>

        <form className={classes.form} onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {isSignUp && <Input name='name' label='用户名' handleChange={handleChange} autoFocus type='text' />}
            <Input name='email' label='邮箱' handleChange={handleChange} type='email' />
            <Input name='password' label='密码' handleChange={handleChange} type={showPassword ? 'text' : 'password'} handleShowPassword={handleShowPassword} />
            {isSignUp && <Input name='confirmPassword' label='再次输入密码' handleChange={handleChange} type='password' />}
          </Grid>
          <Button type='submit' fullWidth variant='contained' color='primary' className={classes.submit}>
            {isSignUp ? '注册' : '登录'}
          </Button>
          <GoogleOAuthProvider clientId={`${process.env.REACT_APP_GOOGLE_API_TOKEN}`}>
            <GoogleLogin
              onSuccess={googleSuccess}
              onError={googleError}
              locale="zh_CN"
            ></GoogleLogin>
          </GoogleOAuthProvider>
          <Grid container justifyContent='flex-end'>
            <Grid item>
              <Button onClick={switchMode}>
                {isSignUp ? '已有账号? 登录' : '还没有账号? 马上注册'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  )
}

export default Auth