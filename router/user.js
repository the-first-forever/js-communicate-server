// 导入模块

const express = require('express')

// 创建路由对象
const router = express.Router()
const userHandler = require('../handler/user')

// 导入验证数据的中间件
const expressJoi = require('@escook/express-joi')
// 导入需要的验证规则对象
const {
    reg_login_schema,
} = require('../utils/user')

// 注册新用户
router.post('/reguser', expressJoi(reg_login_schema) , userHandler.regUser)

// 登录
router.post('/login', expressJoi(reg_login_schema), userHandler.login)


// 抛出 共享路由对象
module.exports = router
