import { CREATE, UPDATE, FETCH_ALL, DELETE, FETCH_BY_SEARCH, START_LOADING, END_LOADING, FETCH_POST, COMMENT } from '../constants/actionTypes'

export default (state = { isLoading: true, posts: [] }, action) => {
    switch (action.type) {
        case START_LOADING: 
            return { ...state, isLoading: true }
        case END_LOADING:
            return { ...state, isLoading: false }
        case FETCH_ALL:
            return { 
                ...state, 
                posts: action?.playload?.data, 
                currentPage: action?.playload?.currentPage,
                numberOfPages: action?.playload?.numberOfPages 
            }
        case FETCH_POST:
            return { ...state, post: action?.playload }
        case FETCH_BY_SEARCH:
            return {
                ...state,
                posts: action.playload
            }
            // return action.playload
        case CREATE:
            return { ...state, posts: [ ...state.posts, action.playload] }
        case UPDATE:
            return { ...state, posts: state.posts.map(post => post._id === action?.playload?._id ? action?.playload : post)}
        case COMMENT: 
            return {
                ...state,
                posts: state.posts.map(post => {
                    if(post._id === action.playload._id){
                        return action.playload
                    }
                    return post
                })
            }
        case DELETE:
            return { ...state, posts: state.posts.filter(post => post._id !== action.playload)}
        default:
            return state
    }
}