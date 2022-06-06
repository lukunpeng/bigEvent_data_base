// 导入定义验证规则的模块
const joi = require('joi')

// 定义 标题、分类Id、内容、发布状态 的验证规则
const title = joi.string().required()
const cate_id = joi.number().integer().min(1).required()
const content = joi.string().required().allow('')
const state = joi.string().valid('已发布', '草稿').required()


// 定义 分类Id 的校验规则
const id = joi.number().integer().min(1).required()
// 验证规则对象 - 发布文章
exports.add_article_schema = {
    body: {
      title,
      cate_id,
      content,
      state,
    },
  }


  exports.delete_article_schema = {
    params: {
      id,
    },
  }

  exports.get_article_schema={
    query:{
      id
    }
  }

  exports.update_article_schema={

    body: {
      Id:id,
      title,
      cate_id,
      content,
      state,

  },


  }