
// 在这里定义和用户相关的路由处理函数，供 /router/user.js 模块进行调用

const db = require('../db/index')

const bcrypt = require('bcryptjs')

// 注册用户的处理函数
exports.regUser = (req, res) => {
    // 接收表单数据
    const userinfo = req.body
    // 判断数据是否合法
    // if (!userinfo.username || !userinfo.password) {
    //     return res.send({ status: 1, message: '用户名或密码不能为空！' })
    // }
    // 定义 SQL 语句，查询用户名是否被占用
    const sqlStr = `select * from ev_users08 where username=?`
    db.query(sqlStr, userinfo.username, (err, results) => {
        // 首先判错  1、执行sql语句是否成功  2、判断用户名是否被占用
        // 1、执行sql语句是否成功
        if (err) {
            // return res.send({ status: 1, message: err.message })
            return res.cc(err)
        }
        // 2、判断用户名是否被占用
        if (results.length > 0) {
            // return res.send({ status: 1, message: '用户名被占用，请更改用户名！' })
            return res.cc('用户名被占用，请更改用户名！')

        }

        // 对用户的密码,进行 bcrype 加密，返回值是加密之后的密码字符串
        userinfo.password = bcrypt.hashSync(userinfo.password, 10)

        // 定义插入新用户的 SQL 语句
        const sql = 'insert into ev_users08 set ?'
        db.query(sql, { username: userinfo.username, password: userinfo.password }, (err, results) => {
            // 先判错
            if (err) return res.send({ code: 1, message: err.message })
            // SQL 语句执行成功，但影响行数不为 1
            if (results.affectedRows !== 1) {
                // return res.send({ status: 0, message: '注册用户失败，请稍后再试！' })
            return res.cc('注册用户失败，请稍后再试！')

            }
        // res.send({ status: 0, message: '注册成功！' })
        res.cc('注册成功',0)

        })
    })
}

// 登录的处理函数
exports.login = (req, res) => {
    res.send('login OK')
}