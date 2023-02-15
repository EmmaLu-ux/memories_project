import * as api from '../api'
import { AUTH } from '../constants/actionTypes'

/* 用户注册 */
export const signup = (formData, navigate) => async (dispatch) => {
    try {
        // sign up
        const { data } = await api.signup(formData)
        // console.log('data-signup: ', data) // { result: { name: ..., .... }, token: ... }
        dispatch({ type: AUTH, playload: data })
        navigate('/', { replace: true })
    } catch (error) {
        console.log(error)
    }
}

/* 用户登录 */
export const signin = (formData, navigate) => async (dispatch) => {
    try {
        // sign in
        const { data } = await api.signin(formData)
        dispatch({ type: AUTH, playload: data })
        navigate('/', { replace: true })
    } catch (error) {
        console.log(error)
    }
}