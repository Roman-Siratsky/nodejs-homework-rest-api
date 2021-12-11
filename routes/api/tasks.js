const express = require('express')
const router = express.Router()
const tasksController = require("../../controllers/tasksController")
const authMiddleware = require('../../middlewares/authMiddleware.js')

router.post('/', authMiddleware, tasksController.addTask)
router.put('/:id', authMiddleware, tasksController.updateTask)
router.delete('/:id', authMiddleware, tasksController.deleteTask)
router.post('/change', authMiddleware, tasksController.updateTaskBoard)
router.put('/position/:id', authMiddleware, tasksController.updateTaskPosition)

module.exports = router