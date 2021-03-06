
// 导入处理路径的 path 核心模块
const path = require('path')

// 导入数据库操作模块
const db = require('../db/index')

// 发布新文章的处理函数
exports.addArticle = (req, res) => {

    // 手动判断是否上传了文章封面
    if (!req.file || req.file.fieldname !== 'cover_img') return res.cc('文章封面是必选参数！')

    const articleInfo = {
        // 标题、内容、状态、所属的分类Id
        ...req.body,
        // 文章封面在服务器端的存放路径
        cover_img: path.join('/uploads', req.file.filename),
        // 文章发布时间
        pub_date: new Date(),
        // 文章作者的Id
        author_id: req.user.id,
    }
    //   定义发布文章的 SQL 语句：
    const sql = `insert into ev_articles08 set ?`

    // 导入数据库操作模块
    const db = require('../db/index')

    // 执行 SQL 语句
    db.query(sql, articleInfo, (err, results) => {
        // 执行 SQL 语句失败
        if (err) return res.cc(err)

        // 执行 SQL 语句成功，但是影响行数不等于 1
        if (results.affectedRows !== 1) return res.cc('发布文章失败！')

        // 发布文章成功
        res.cc('发布文章成功', 0)
    })
}


// 定义筛选，渲染，分页，获取文章数据路由
exports.addArticleList = (req, res) => {
    if (req.query.state && req.query.cate_id) {
        const sql = `select count(*) from (select articles.Id, articles.title, cate.name as cate_name, articles.pub_date, articles.state from ev_articles08  articles inner join ev_article_cate08 cate on articles.cate_id = cate.Id and articles.is_delete=0  and articles.state="${req.query.state}" and articles.cate_id="${req.query.cate_id}") as total;`
        db.query(sql, (err, results) => {
            // 1. 执行 SQL 语句失败
            if (err) return res.cc(err)
            // 2. 执行 SQL 语句成功
            const total = results[0]['count(*)']
            const sql = `select articles.Id, articles.title, cate.name as cate_name, articles.pub_date, articles.state from ev_articles08 articles inner join ev_article_cate08 cate on articles.cate_id = cate.Id and articles.is_delete=0 and articles.state="${req.query.state}" and articles.cate_id="${req.query.cate_id}" limit ${req.query.pagesize - 0} offset ${(req.query.pagenum - 1) * req.query.pagesize};`
            db.query(sql, (err, results) => {
                // 1. 执行 SQL 语句失败
                if (err) return res.cc(err)
                // 2. 执行 SQL 语句成功
                res.send({
                    code: 0,
                    message: '获取文章分类列表成功！',
                    data: results,
                    total,
                })
            })
        })
    } else {
        const sql = 'select count(*) from ev_articles08 where ev_articles08.is_delete=0;'
        db.query(sql, (err, result) => {
            // 1. 执行 SQL 语句失败
            if (err) return res.cc(err)
            const sql = `select articles.Id, articles.title, cate.name as cate_name, articles.pub_date, articles.state from ev_articles08 articles inner join ev_article_cate08 cate on articles.cate_id = cate.Id and articles.is_delete=0 limit ${req.query.pagesize - 0} offset ${(req.query.pagenum - 1) * req.query.pagesize};`
            db.query(sql, (err, results) => {
                // 1. 执行 SQL 语句失败
                if (err) return res.cc(err)
                // 2. 执行 SQL 语句成功
                const total = result[0]['count(*)']
                res.send({
                    code: 0,
                    message: '获取文章分类列表成功！',
                    data: results,
                    total,
                })
            })
        })

    }

}


// 定义删除文章的处理函数
exports.delArticle = (req, res) => {

    // 定义sql语句
    const sql = `update ev_articles08 set is_delete=1 where id=?`

    db.query(sql, req.params.id, (err, results) => {
        // 执行 SQL 语句失败
        if (err) return res.cc(err)

        // SQL 语句执行成功，但是影响行数不等于 1
        if (results.affectedRows !== 1) return res.cc('删除文章分类失败！')

        // 删除文章分类成功
        res.cc('删除文章成功！', 0)
    })
}

// 编辑的时候获取文章信息
exports.getArticleId = (req, res) => {
    const sql = `select * from ev_articles08 where id=?`
    db.query(sql, req.query.id, (err, results) => {
        // 执行 SQL 语句失败
        if (err) return res.cc(err)

        // SQL 语句执行成功，但是没有查询到任何数据
        if (results.length !== 1) return res.cc('获取文章内容数据失败！')

        // 把数据响应给客户端
        res.send({
            code: 0,
            message: '获取文章分类数据成功！',
            data: results[0],
        })
    })
}

// 更新文章内容
exports.editArticleId = (req, res) => {
    // 定义查询 分类名称 与 分类别名 是否被占用的 SQL 语句
        // TODO：更新文章分类

        // 定义更新文章分类的 SQL 语句：
        const sql = `update ev_articles08 set ? where Id=?`
        db.query(sql, [req.body, req.body.Id], (err, results) => {
            // 执行 SQL 语句失败
            if (err) return res.cc(err)

            // SQL 语句执行成功，但是影响行数不等于 1
            if (results.affectedRows !== 1) return res.cc('更新文章分类失败！')

            // 更新文章分类成功
            res.cc('更新文章分类成功！', 0)
        })
    


}