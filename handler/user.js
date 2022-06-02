// 导入数据库操作模块
const db = require('../db/index')

// 导入密码加密模块
const bcrypt = require('bcryptjs')

// 导入 token 生成包
// 用这个包来生成 Token 字符串
const jwt = require('jsonwebtoken')
// 导入全局的配置文件
const config = require('../config')

// 定义用户相关路由处理函数

// 注册用户处理函数
exports.regUser = ( req , res ) => {
    // 获取客户端提交到服务器的数据
    const userinfo = req.body

    if ( !userinfo.username || !userinfo.password ) return res.send({ code : '400', data : null, massgae : '用户名或密码不合法' })

    // 定义 sql 语句，查询用户名是否被占用
    const sqlStr = 'select * from ev_users where username=?'

    db.query( sqlStr , userinfo.username , ( err , results ) => {
        // 执行 sql 语句失败
        if ( err ) {
            return res.send({
                code : 500, 
                message : err.message
            })
        } 
        // 判断用户名是否被占用
        if ( results.length > 0 ) return res.send({ code : 400, message : '用户名被占用，请更换其他用户名！' })
        
        // 调用 bcrypt.hashSync() 方法对密码进行加密
        userinfo.password = bcrypt.hashSync( userinfo.password , 10 )

        // 定义插入新用户的 sql 语句
        const sql = 'insert into ev_users set ?'
        // 调用 db.query 执行 sql 语句
        db.query(sql, { username: userinfo.username, password: userinfo.password }, function (err, results) {
            // 执行 SQL 语句失败
            if (err) return res.send({ code: 400, message: err.message })

            // SQL 语句执行成功，但影响行数不为 1
            if (results.affectedRows !== 1) {
                return res.send({ code: 400, message: '注册用户失败，请稍后再试！' })
            } else {
                // 注册成功
                return res.send({ code: 200, message: '注册成功！' })    
            }
            
        })
    })

    



}

// 登录用户处理函数
exports.login = ( req , res ) => {

    const userinfo = req.body

    if ( !userinfo.username || !userinfo.password ) return res.send({ code : '400', data : null, massgae : '用户名或密码不合法' })

    // 定义 sql 语句，查询用户名是否被占用
    const sql = 'select * from ev_users where username=?'

    db.query( sql , userinfo.username , ( err , results ) => {
        // 执行 sql 语句失败
        if ( err ) return res.send({ code : 500,  message : err.message })

        // 判断用户名是否存在
        if ( results.length !== 1 ) return res.send({ code : 400, message : '用户名不存在！' })

        // 拿着用户输入的密码,和数据库中存储的密码进行对比
        const compareResult = bcrypt.compareSync( userinfo.password, results[0].password)
        // 如果对比的结果等于 false, 则证明用户输入的密码错误
        if (!compareResult) return res.send({ code : 400, message : '登录失败！' })
        
        // 在服务端生成 token 字符串
        // 剔除完毕之后，user 中只保留了用户的 id, username, nickname, email 这四个属性的值
        const user = { ...results[0], password: '', user_pic: '' }
        
        // 对用户信息进行加密，生成 token 字符串
        const tokenStr = jwt.sign( user, config.jwtSecretKey , { expiresIn : config.expireIn } )

        res.send({
            code : 200,
            message : '登录成功',
            token : 'Bearer' + tokenStr
        })
    })

    
}