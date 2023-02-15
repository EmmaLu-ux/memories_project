import mongoose from "mongoose";

const postSchema = mongoose.Schema({
    title: String, // 标题
    message: String, // 文本内容
    name: String, // 用户名
    creator: String, // 创建者的id
    tags: [String], // 标签
    selectedFile: String, // 选中的文件（将图片通过Base64编码为字符串）
    likes: { // 喜欢该文章的用户id组成的数组
        type: [String],
        default: []
    },
    comments: {
        type: [String],
        default: []
    },
    createdAt: {  // 该文章创建的日期
        type: Date,
        default: new Date()
    },
})

// 将postSchema转成我们可以用的模型，该模型命名为 PostMessage
const PostMessage = mongoose.model('PostMessage', postSchema)
export default PostMessage
