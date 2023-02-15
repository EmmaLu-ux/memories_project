import bcrypt from 'bcryptjs' // 特点：1.每一次哈希出来的值都不一样，2.计算非常缓慢
import jwt from 'jsonwebtoken'

import User from '../models/user.js'

export const signin = async (req, res) => {
    const { email, password } = req.body
    try {
        const existingUser = await User.findOne({ email })
        if(!existingUser) return res.status(404).json({ message: '用户不存在! '})

        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password)
        if(!isPasswordCorrect) return res.status(400).json({ message: '密码错误! '})

        const token = jwt.sign({ email: existingUser.email, id: existingUser._id }, 'test', { expiresIn: '1h' })
        res.status(200).json({ result: existingUser, token })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const signup = async (req, res) => {
    const { name, email, password, confirmPassword } = req.body
    // console.log(name, email, password, confirmPassword)
    try {
        const existingUser = await User.findOne({ email })
        if(existingUser) return res.status(400).json({ message: '该用户已存在! '})
        if(password !== confirmPassword) res.status(400).json({ message: '密码不一致! '})

        const hashPassword = await bcrypt.hash(password, 12)
        const result = await User.create({ email, password: hashPassword, name})
        const token = jwt.sign({ email: result.email, id: result._id }, 'test', { expiresIn: '1h' })
        res.status(200).json({ result, token })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}