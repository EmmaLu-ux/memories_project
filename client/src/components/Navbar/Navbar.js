import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AppBar, Typography, Toolbar, Avatar, Button } from '@material-ui/core'
import { useDispatch } from 'react-redux'
import { useNavigate, useLocation } from 'react-router-dom'
import decode from 'jwt-decode'

import memoriesLogo from '../../images/memories-Logo.png'
import memoriesText from '../../images/memories-Text.png'
import useStyles from './styles'
import { LOGOUT } from '../../constants/actionTypes'

const Navbar = () => {
    const classes = useStyles()
    const [user, setUser] = useState(JSON.parse(sessionStorage.getItem('profile')))
    // console.log('user: ', user)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const location = useLocation()

    const logout = () => {
        dispatch({ type: LOGOUT })
        navigate('/', { replace: true })
        setUser(null)
    }

    useEffect(() => {
        const token = user?.token
        if(token){
            const decodeToken = decode(token)
            if(decodeToken.exp * 1000 < new Date().getTime()) logout()
        }
        setUser(JSON.parse(sessionStorage.getItem('profile')))
    }, [location])
    
    return (
        <AppBar className={classes.appBar} position='static' color='inherit'>
            <Link to='/' className={classes.brandContainer}>
                {/* <Typography component={Link} to='/' className={classes.heading} variant='h2' align='center'>Memories</Typography> */}
                <img src={memoriesText} alt='icon' height='45px'/>
                <img className={classes.image} src={memoriesLogo} alt='memories' height='50px' />
            </Link>
            <Toolbar className={classes.toolbar}>
                {user ? (
                    <div className={classes.profile}>
                        <Avatar className={classes.purple} alt={user?.result?.name} src={user?.result?.picture}>{user?.result?.name.charAt(0)}</Avatar>
                        <Typography className={classes.userName} variant='h6'>{user?.result?.name}</Typography>
                        <Button variant='contained' className={classes.logout} color='secondary' onClick={logout}>退出登录</Button>
                    </div>
                ) : (
                    <Button component={Link} to='/auth' variant='contained' color='primary'>登录</Button>
                )}
            </Toolbar>
        </AppBar>
    )
}

export default Navbar