import * as api from '../api'

import { CREATE, UPDATE, FETCH_ALL, DELETE, FETCH_BY_SEARCH, START_LOADING, END_LOADING, FETCH_POST, COMMENT } from '../constants/actionTypes'

// action creators   thunk  异步获取数据
export const getPosts = (page) => async (dispatch) => {
    try {
        dispatch({ type: START_LOADING })
        const { data } = await api.fetchPosts(page) // data: { data, currentPage, numberOfPages }
        console.log('page-getPosts:', data)
        dispatch({ type: FETCH_ALL, playload: data}) // data: { data, currentPage, numberOfPages }
        dispatch({ type: END_LOADING })
    } catch (error) {
        console.log('error-actions-getPosts: ', error.message)
    }
}

/* post详情用 */
export const getPost = (id) => async (dispatch) => {
    try {
        dispatch({ type: START_LOADING })
        const { data } = await api.fetchPost(id)
        
        // console.log('page-getPost:', data)

        dispatch({ type: FETCH_POST, playload: data })
        dispatch({ type: END_LOADING })
    } catch (error) {
        console.log('error-actions-getPosts: ', error.message)
    }
}

/* 通过搜索来获取posts */
export const getPostsBySearch = (searchQuery) => async (dispatch) => {
    try {
        dispatch({ type: START_LOADING })
        const { data: { data } } = await api.fetchPostsBySearch(searchQuery)
        
        // console.log('search-data:', data)
        dispatch({ type: FETCH_BY_SEARCH, playload: data})
        dispatch({ type: END_LOADING })
    } catch (error) {
        console.log('error-actions-getPostsBySearch: ', error.message)
    }
}

export const createPost = (post, navigate) => async (dispatch) => {
    try {
        dispatch({ type: START_LOADING })
        const { data } = await api.createPost(post)
        // console.log('data-actions-createPost:', data)
        navigate(`/posts/${data._id}`)
        dispatch({ type: CREATE, playload: data })
        dispatch({ type: END_LOADING })
    } catch (error) {
        console.log('error-actions-createPost: ', error.message)
    }
}

export const updatePost = (id, post) => async (dispatch) => {
    try {
        const { data } = await api.updatePost(id, post)
        // console.log('data: ', data)
        dispatch({ type: UPDATE, playload: data})
    } catch (error) {
        console.log('error-actions-updatePost: ', error.message)
    }
}

export const deletePost = (id) => async (dispatch) => {
    try {
        await api.deletePost(id)
        dispatch({ type: DELETE, playload: id})
    } catch (error) {
        console.log('error-actions-deletePost: ', error.message)
    }
}

export const likePost = (id) => async (dispatch) => {
    try {
        const { data } = await api.likePost(id)
        // console.log('data: ', data) // 点赞的这个post数据
        dispatch({ type: UPDATE, playload: data })
    } catch (error) {
        console.log('error-actions-likePost: ', error)
    }
}

export const commentPost = (value, id) => async (dispatch) => {
    try {
        const { data } = await api.comment(value, id)
        // console.log('data-commentPost-action: ', data)
        dispatch({ type: COMMENT, playload: data })
        return data.comments
    } catch (error) {
        console.log('error-actions-commentPost: ', error)
    }
}