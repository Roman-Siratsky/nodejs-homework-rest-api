const express = require('express')
const router = express.Router()
const tasksController = require("../../controllers/tasksController")
const authMiddleware = require('../../middlewares/authMiddleware.js')

router.post('/', authMiddleware, tasksController.addTask)
router.put('/:id', authMiddleware, tasksController.updateTask)
router.post('/change', authMiddleware, tasksController.updateTaskBoard)

module.exports = router