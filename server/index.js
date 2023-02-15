import express from 'express'
// import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'
import dotenv from 'dotenv'

import postsRoutes from './routes/posts.js'
import userRoutes from './routes/user.js'

const app = express()
dotenv.config()

app.use(express.json({ limit: '30mb' })) // 处理http请求体，目前不太常用，由express内置中间件替代
app.use(express.urlencoded({ limit: '30mb', extended: true }))
app.use(cors()) // 用于跨域资源请求

// 挂载路由：将路由集成到Express实例应用中
// 给路由限定了访问前缀：/posts
app.use('/posts', postsRoutes)
app.use('/user', userRoutes)

// const CONNECTION_URL = 'mongodb://genhualu:genhualugenhualu123@ac-g6dhzl1-shard-00-00.yrjg9md.mongodb.net:27017,ac-g6dhzl1-shard-00-01.yrjg9md.mongodb.net:27017,ac-g6dhzl1-shard-00-02.yrjg9md.mongodb.net:27017/?ssl=true&replicaSet=atlas-vvxzs5-shard-0&authSource=admin&retryWrites=true&w=majority'
const PORT = process.env.PORT || 5000

mongoose.set('strictQuery', false)

mongoose.connect(process.env.CONNECTION_URL)
    .then(() => app.listen(PORT, () => console.log(`Server running at port ${PORT}`)))
    .catch(error => console.log('error-mongoose: ', error.message))