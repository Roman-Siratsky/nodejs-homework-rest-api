const Joi = require('@hapi/joi')

const createTaskScheme = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  priority: Joi.string().required(),
  boardId: Joi.string().required(),
  position: Joi.number().required(),
})

const updateTaskScheme = Joi.object({
  title: Joi.string(),
  description: Joi.string(),
  priority: Joi.string(),
  position: Joi.number(),
})

const changeTaskBoardScheme = Joi.object({
  boardId: Joi.string().required(),
  taskId: Joi.string().required(),
  position: Joi.number().required(),
  prevBoardId: Joi.string().required()
})

const changeTaskPosScheme = Joi.object({
  boardId: Joi.string().required(),
  position: Joi.number().required(),
})

module.exports = {
  createTaskScheme,
  updateTaskScheme,
  changeTaskBoardScheme,
  changeTaskPosScheme,
}