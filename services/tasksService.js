const Task = require('../schemas/taskScheme')

class TasksService {
    constructor() { }

    async getAll() {
        const tasks = await Task.find()
        return tasks
    }

    async create(task) {
        await Task.create(task)
    }

    async update(id, task) {
        const updatedTask = await Task.findByIdAndUpdate(id, {...task}, { new: true })
        return updatedTask
    }

    async updateTaskBoard(taskId, boardId) {
        const updatedTask = await Task.findByIdAndUpdate(taskId, {boardId}, { new: true })
        console.log(updatedTask);
        return updatedTask
    }

    async getUserTasks(userId) {
        const userTasks = await Task.find({ userId })
        return userTasks
    }

    async deleteTask(taskId) {
        const userTasks = await Task.findByIdAndDelete(taskId)
        return
    }

    async updatePosition(taskId, position) {
        await Task.findByIdAndUpdate(taskId, {position}, {new: true})
        return
    }
}

module.exports = new TasksService();