// 导入所需库
const Sequelize = require('sequelize')

const config = process.env.NODE_ENV === 'dev' ? require('../config/db.dev') : require('../config/db.prod')

const seq = new Sequelize(config.database, config.dbUserName, config.dbPassword, config.conf)

// 测试连接
seq
  .authenticate()
  .then(() => {
    console.log('数据库连接成功')
  })
  .catch(e => {
    console.log('数据库连接失败\n', e)
    throw new Error()
  })

module.exports = seq
