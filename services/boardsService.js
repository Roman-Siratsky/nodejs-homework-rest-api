const Board = require('../schemas/boardsScheme')
const TaskService = require("./tasksService")
class BoardsService {
  constructor() { }

  async getAll() {
    const boards = await Board.find()
    return boards
  }
  
  async updateBoard(id, newBoard) {
    console.log(newBoard);
    const board = await Board.findOneAndUpdate({ _id: id }, {tasks: [...newBoard.tasks]})
    console.log(board);
    return board
  }

  async addBoardTask(id, newTask) {
    const prevBoard = await Board.findOne({_id: id})
    const board = await Board.findOneAndUpdate({ _id: id }, { tasks: [...prevBoard.tasks, newTask] })
    return board
  }

  async deleteBoardTask(id, taskId) {
    const prevBoard = await Board.findOne({ _id: id })
    const newTaskList = prevBoard.tasks.filter(el => el._id != taskId)
    const board = await Board.findOneAndUpdate({ _id: id }, { tasks: newTaskList })
    return board
  }

  async getBoardsWithTasks(userId) {
    const boards = await Board.find()
    const userTasks = await TaskService.getUserTasks(userId)
    const boardsWithTasks = boards.map(board => {
      board.items = userTasks.filter(task =>
        JSON.stringify(task.boardId) === JSON.stringify(board._id)
      ).sort((a, b) => a.position - b.position)
      return board
    })
    return boardsWithTasks;
  }
}

module.exports = new BoardsService();