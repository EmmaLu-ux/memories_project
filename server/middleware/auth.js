import jwt from 'jsonwebtoken'

const auth = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1]
        const isCustomAuth = token.length < 500
        let decodeData

        if(token && isCustomAuth){ //user token
            decodeData = jwt.verify(token, 'test')
            req.userId = decodeData?.id // 拿到发起该请求的用户的用户id
        }else{ // google token
            decodeData = jwt.decode(token)
            req.userId = decodeData?.sub
        }
        next()
    } catch (error) {
        console.log(error)
    }
}

export default auth