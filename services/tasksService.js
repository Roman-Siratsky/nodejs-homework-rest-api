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
        const updatedTask = await Task.findByIdAndUpdate(id, { ...task }, { new: true })
        return updatedTask
    }

    async updateTaskBoard({ taskId, boardId, position, prevBoardId, userId }) {
        const task = await Task.findById(taskId)
        const currentPosition = task.position;
        const updatedTask = await Task.findByIdAndUpdate(taskId, { boardId, position }, { new: true })
        const tasks = await Task.find({ userId, boardId: prevBoardId })
        tasks.forEach(async (el) => {
            if (el.position > currentPosition) el.position -= 1
            await el.markModified("tasks")
            await el.save()
        })
        return updatedTask
    }

    async getUserTasks(userId) {
        const userTasks = await Task.find({ userId })
        return userTasks
    }

    async getUserBoardTasks(userId, boardId) {
        const tasks = await Task.find({ userId, boardId })
        return tasks
    }

    async deleteTask({ userId, boardId, taskId }) {
        const task = await Task.findById(taskId)
        const tasks = await Task.find({ userId, boardId: task.boardId })
        const currentPosition = task.position;
        tasks.forEach(async (el) => {
            if (el.position > currentPosition) el.position -= 1
            await el.markModified("tasks")
            await el.save()
        })
        await Task.findByIdAndDelete(taskId)
        return
    }

    async updatePosition({ userId, boardId, taskId, position }) {
        const tasks = await Task.find({ userId, boardId }, null, { sort: { position: 1 } })
        const task = tasks.find(el => String(el._id) === taskId)
        const currentPosition = task.position;

        if (currentPosition < position) { //перемещаем вниз
            console.log("FIRST IF");
            tasks.forEach(async (el) => {
                if (el.position === currentPosition) {
                    el.position = position;
                    console.log("CURRENT FIRST EL", el);
                }
                if (el.position > currentPosition && el.position <= position && String(el._id) !== taskId) {
                    el.position -= 1;
                    console.log("OTHER FIRST EL", el);
                }
                await el.markModified("tasks")
                await el.save()
            })
        }

        if (currentPosition > position) {//перемещаем вверх
            console.log("SECOND IF");
            tasks.forEach(async (el) => {
                if (el.position === currentPosition) {
                    el.position = position;
                    console.log("CURRENT SECOND EL", el);
                }
                if (el.position >= position && el.position < currentPosition && String(el._id) !== taskId) {
                    el.position += 1;
                    console.log("OTHER SECOND EL", el);
                }
                await el.markModified("tasks")
                await el.save()
            })
        }
        return
    }
}

module.exports = new TasksService();