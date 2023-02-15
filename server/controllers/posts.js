import mongoose from 'mongoose'
import PostMessage from '../models/postMessage.js'

/* 从数据库中获取到所有的Posts */
export const getPosts = async (req, res) => {
    const { page } = req.query
    try {
        const LIMIT = 8 // 每一页显示8条post
        const startIndex = (Number(page) - 1) * LIMIT // 用户所请求页的第一个post的索引
        const total = await PostMessage.countDocuments({}) // posts的数量

        const posts = await PostMessage.find().sort({ _id: -1 }).limit(LIMIT).skip(startIndex)
        return res.status(200).json({ data: posts, currentPage: Number(page), numberOfPages: Math.ceil(total / LIMIT) })
    } catch (error) {
        return res.status(404).json({ message: error.message })
    }
}

export const getPost = async (req, res) => {
    const { id } = req.params
    // console.log('id: ', id)
    try {
        const post = await PostMessage.findById(id)

        return res.status(200).json(post)
    } catch (error) {
        return res.status(404).json({ message: error.message })
    }
}

/* 通过搜索posts来获取posts */
export const getPostsBySearch = async (req, res) => {
    const { searchQuery, tags } = req.query
    try {
        const title = new RegExp(searchQuery, 'i')
        const posts = await PostMessage.find({ $or: [{ title }, { tags: { $in: tags.split(',') } }] })

        return res.json({ data: posts })
    } catch (error) {
        return res.status(404).json({ message: error.message })
    }
}

/* 创建Post */
export const createPost = async (req, res) => {
    const post = req.body
    // console.log('post-createPost-controllers:', post)
    // 模型(model)的实例是文档(document) 文档有许多自己内置的实例方法。我们也可以定义我们自己的自定义文档实例方法。
    // 常用的内置实例方法：remove、set、get、invalidate、populate、save等
    // 常用的内置静态方法：create、find、findOne等
    const newPost = new PostMessage({ ...post, creator: req.userId, createdAt: new Date().toISOString() }) // 在数据库中创建了一个新的post数据
    try {
        await newPost.save()
        return res.status(201).json(newPost)
    } catch (error) {
        return res.status(409).json({ message: error.message })
    }
}

/* 更新Post */
export const updatePost = async (req, res) => {
    const { id: _id } = req.params
    const post = req.body
    if (!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send('No post with that id')
    const updatedPost = await PostMessage.findByIdAndUpdate(_id, post, { new: true })
    res.json(updatedPost)
}

/* 删除Post */
export const deletePost = async (req, res) => {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send('No post with that id')
    await PostMessage.findByIdAndRemove(id)
    res.json({ message: 'Post deleted successfully!' })
}

/* 点赞：即喜欢一个Post */
export const likePost = async (req, res) => {
    const { id } = req.params
    if (!req.userId) res.json({ message: '您没有点赞权限! ' })
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send('No post with that id')
    const post = await PostMessage.findById(id)
    const index = post.likes.findIndex(id => String(req.userId) === id) // 将用户id和post的likes内的某个用户id进行比对
    if (index === -1) {
        // 点赞，在likes内增加该用户的id
        post.likes.push(req.userId)
    } else {
        // 移除点赞的用户的id
        post.likes = post.likes.filter(id => id !== String(req.userId))
    }
    const updatedPost = await PostMessage.findByIdAndUpdate(id, post, { new: true })

    res.json(updatedPost)
}

export const commentPost = async (req, res) => {
    const { id } = req.params
    const { value } = req.body
    const post = await PostMessage.findById(id)
    post.comments.push(value)
    const updatedPost = await PostMessage.findByIdAndUpdate(id, post, { new: true })
    res.json(updatedPost)
}