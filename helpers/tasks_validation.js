const Joi = require('@hapi/joi')

const createTaskScheme = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  priority: Joi.string().required(),
  boardId: Joi.string().required(),
})

const updateTaskScheme = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  priority: Joi.string().required(),
})

const changeTaskBoardScheme = Joi.object({
  boardId: Joi.string().required(),
  taskId: Joi.string().required(),
})

module.exports = {
  createTaskScheme,
  updateTaskScheme,
  changeTaskBoardScheme,
}