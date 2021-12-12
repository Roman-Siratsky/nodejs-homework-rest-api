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
    const {boardId, taskId, position} = req.body
    const updatedTask = await TaskService.updateTaskBoard(taskId, boardId, position)
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

const deleteTask = async (req, res, next) => {
  try {
    const {id} = req.params
    const { boardId } = req.body
    await TaskService.deleteTask({
      userId: req.user.id,
      boardId,
      taskId: id
    })
    return res.status(http.DELETED).json({
      status: http.DELETED,
      code: http.DELETED,
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
    const userTasks = await TaskService.getUserTasks(req.user.id)
    const boards = await BoardsService.getAll()
    const boardsWithTasks = boards.map(board => {
      board.items = userTasks.filter(task =>
        JSON.stringify(task.boardId) === JSON.stringify(board._id)
      ).sort((a, b) => a.position - b.position)
      return board
    })
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