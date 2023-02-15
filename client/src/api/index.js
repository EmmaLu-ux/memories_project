import axios from 'axios'

// 自定义创建一个新的axios实例
const API = axios.create({ baseURL: 'http://localhost:5000' })

/* 让middleware起作用的部分 */
API.interceptors.request.use(req => {
    if(sessionStorage.getItem('profile')){
        req.headers.Authorization = `Bearer ${JSON.parse(sessionStorage.getItem('profile')).token}`
    }
    return req
})

// const url = 'http://localhost:5000/posts'

export const fetchPosts = (page) => API.get(`/posts?page=${page}`)
export const fetchPost = (id) => API.get(`/posts/${id}`)
export const fetchPostsBySearch = (searchQuery) => API.get(`/posts/search?searchQuery=${searchQuery.search || 'none'}&tags=${searchQuery.tags}`)

export const createPost = (newPost) => API.post('/posts', newPost)
export const updatePost = (id, updatedPost) => API.patch(`/posts/${id}`, updatedPost)
export const deletePost = (id) => API.delete(`/posts/${id}`)
export const likePost = (id) => API.patch(`/posts/${id}/likeCount`)
export const comment = (value, id) => API.post(`/posts/${id}/commentPost`, { value })

export const signin = (formData) => API.post('/user/signin', formData)
export const signup = (formData) => API.post('/user/signup', formData)