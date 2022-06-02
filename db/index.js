// 连接数据库

// 导入 mysql 模块
const mysql = require('mysql')

// 创建数据库连接对象

const db = mysql.createPool({
    host : '127.0.0.1',  // 连接地址
    user : 'root',  // 连接名
    password : '12345678', // 连接密码
    database : 'sys'
})

// 向外共享数据库对象
module.exports = db