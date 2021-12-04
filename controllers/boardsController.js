const BoardsService = require("../services/boardsService.js")
const http = require("../helpers/status.js")
const TaskService = require("../services/tasksService")

const listBoards = async (req, res, next) => {
  try {
    const userTasks = await TaskService.getUserTasks(req.user.id)
    const boards = await BoardsService.getAll()
    const boardsWithTasks = boards.map(board => {
      board.items = userTasks.filter(task =>
        JSON.stringify(task.boardId) === JSON.stringify(board._id)
      )
      return board
    })
    return res.status(http.OK).json({
      status: "success",
      code: http.OK,
      items: boardsWithTasks,
    })
  } catch (e) {
    return next(e)
  }
}

module.exports = {
  listBoards,
}