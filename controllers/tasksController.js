// const TasksService = require("../services/tasksService.js")
const http = require("../helpers/status.js")
const taskValidation = require("../helpers/tasks_validation")
const TaskService = require("../services/tasksService")
const BoardsService = require("../services/boardsService")

const addTask = async (req, res, next) => {
  try {
    await taskValidation.createTaskScheme.validateAsync(req.body)
    const newTask = req.body;
    newTask.userId = req.user.id;
    await TaskService.create(newTask)
    const boardsWithTasks = await BoardsService.getBoardsWithTasks(req.user.id)
    return res.status(http.OK).json({
      status: "success",
      code: http.OK,
      items: boardsWithTasks,
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
    const boardsWithTasks = await BoardsService.getBoardsWithTasks(req.user.id)
    return res.status(http.OK).json({
      status: "success",
      code: http.OK,
      items: boardsWithTasks,
    })
  } catch (e) {
    next(e)
  }
}

const updateTaskBoard = async (req, res, next) => {
  try {
    await taskValidation.changeTaskBoardScheme.validateAsync(req.body)
    const {boardId, taskId, position, prevBoardId} = req.body
    const updatedTask = await TaskService.updateTaskBoard({taskId, boardId, position, prevBoardId, userId: req.user.id})
    if (!updatedTask) {
      return res.status(http.NOT_FOUND).json({
        status: "error",
        code: http.NOT_FOUND,
        message: "no task found"
      })
    }
    const boardsWithTasks = await BoardsService.getBoardsWithTasks(req.user.id)
    return res.status(http.OK).json({
      status: "success",
      code: http.OK,
      items: boardsWithTasks,
    })
  } catch (e) {
    next(e)
  }
}

const deleteTask = async (req, res, next) => {
  try {
    const {id} = req.params
    const { boardId } = req.body
    await TaskService.deleteTask({
      userId: req.user.id,
      boardId,
      taskId: id
    })
    const boardsWithTasks = await BoardsService.getBoardsWithTasks(req.user.id)
    return res.status(http.OK).json({
      status: "success",
      code: http.OK,
      items: boardsWithTasks,
    })
  } catch (e) {
    next(e)
  }
}

const updateTaskPosition = async (req, res, next) => {
  const { id } = req.params
  await taskValidation.changeTaskPosScheme.validateAsync(req.body)
  const { position, boardId } = req.body
  try {
    await TaskService.updatePosition({
      userId: req.user.id,
      boardId,
      taskId: id,
      position,
    })
    const boardsWithTasks = await BoardsService.getBoardsWithTasks(req.user.id)
    return res.status(http.OK).json({
      status: "success",
      code: http.OK,
      items: boardsWithTasks,
    })
  } catch (e) {
    next(e)
  }
} 

module.exports = {
  addTask,
  updateTask,
  updateTaskBoard,
  deleteTask,
  updateTaskPosition,
}