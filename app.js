
// 导入 express 模块
const express = require('express')
// 导入 cors 模块
const cors = require('cors')
// 导入 bodyParser 模块
const bodyParser = require('body-parser')
// 导入验证规则模块
const joi = require('joi')
// 导入用户路由模块
const userRouter = require('./router/user')

// 创建服务器实例化对象
const app = express()

// 导入配置文件
const config = require('./config')
// 解析 token 的中间件
const expressJWT = require('express-jwt')
// 使用 .unless({ path: [/^\/api\//] }) 指定哪些接口不需要进行 Token 的身份认证
app.use(expressJWT({ secret: config.jwtSecretKey }).unless({ path: [/^\/api\//] }))


// 配置 cors 中间件 - 跨域
app.use(cors())
// 配置解析表单数据的中间件 - (解析数据格式：application/x-www-form-urlencoded )
app.use(express.urlencoded({
    extended : false
}))
app.use(express.json({
    extended : false
}))
app.use(bodyParser.urlencoded({
    extended : false
}))



// 响应数据的中间件 - 在路由之前封装
// app.use(function (req, res, next) {
//     // code = 200 为成功； status = 1 为失败； 默认将 code 的值设置为 200 ，方便处理失败的情况
//     res.os_results = function (err, code = 200 ) {
//       res.send({
//         // 状态
//         code,
//         // 状态描述，判断 err 是 错误对象 还是 字符串
//         message: err instanceof Error ? err.message : err,
//       })
//     }
//     next()
// })

app.use(bodyParser.json())

app.use( '/api' , userRouter )

// 定义错误级别的中间件
app.use((err , req ,  res , next ) => {
    // 验证失败导致的错误
    if (err instanceof joi.ValidationError) return res.send({ code : 400,  message : err.message })
    // 未知错误
    res.send({
        code : 500, 
        message : err.message
    })
})

app.listen( 4000 , () => {
    console.log('服务启动成功！') // 服务器启动成功后返回的回调
})