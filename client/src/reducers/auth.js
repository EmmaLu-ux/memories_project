import { AUTH, LOGOUT } from '../constants/actionTypes'

export default (state = { authData: null }, action) => {
    switch (action.type) {
        case AUTH:
            // console.log(action?.playload)
            sessionStorage.setItem('profile', JSON.stringify({ ...action?.playload }))
            
            return { ...state, authData: action?.playload}
        case LOGOUT:
            sessionStorage.clear()
            return { ...state, authData: null}
        default:
            return state
    }
}