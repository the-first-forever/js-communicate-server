const seq = require('./db')
require('./user.model')

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

// force 如果现在创建的数据库和数据库中的数据库名字相同，则删除数据库中的数据
seq
  .sync({ force: true })
  .then(() => {
    console.log('数据同步成功')
    process.exit()
  })
  .catch(e => {
    console.log('database sync failed.\n', e)
  })
