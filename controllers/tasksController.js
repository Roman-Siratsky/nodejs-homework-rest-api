// const TasksService = require("../services/tasksService.js")
const http = require("../helpers/status.js")
const taskValidation = require("../helpers/tasks_validation")
const TaskService = require("../services/tasksService")

const addTask = async (req, res, next) => {
  try {
    await taskValidation.createTaskScheme.validateAsync(req.body)
    const newTask = req.body;
    newTask.userId = req.user.id;
    await TaskService.create(newTask)
    return res.status(http.CREATED).json({
      status: http.CREATED,
      code: http.CREATED,
    })
  } catch (e) {
    next(e)
  }
}

const updateTask = async (req, res, next) => {
  try {
    await taskValidation.updateTaskScheme.validateAsync(req.body)
    const {id} = req.params
    if (!id) {
      return res.status(http.BAD_REQUEST).json({
        status: "error",
        code: http.BAD_REQUEST,
        message: "id is not specified"
      })
    }
    const updatedTask = await TaskService.update(id, req.body)
    if (!updatedTask) {
      return res.status(http.NOT_FOUND).json({
        status: "error",
        code: http.NOT_FOUND,
        message: "no task found"
      })
    }
    return res.status(http.UPDATED).json({
      status: http.UPDATED,
      code: http.UPDATED,
    })
  } catch (e) {
    next(e)
  }
}

const updateTaskBoard = async (req, res, next) => {
  try {
    await taskValidation.changeTaskBoardScheme.validateAsync(req.body)
    const {boardId, taskId} = req.body
    const updatedTask = await TaskService.updateTaskBoard(taskId, boardId)
    if (!updatedTask) {
      return res.status(http.NOT_FOUND).json({
        status: "error",
        code: http.NOT_FOUND,
        message: "no task found"
      })
    }
    return res.status(http.UPDATED).json({
      status: http.UPDATED,
      code: http.UPDATED,
    })
  } catch (e) {
    next(e)
  }
}

module.exports = {
  addTask,
  updateTask,
  updateTaskBoard,
}