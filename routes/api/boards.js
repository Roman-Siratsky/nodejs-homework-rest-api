const express = require('express')
const router = express.Router()
const boardsController = require('../../controllers/boardsController.js')
const authMiddleware = require('../../middlewares/authMiddleware.js')

router.get('/', authMiddleware, boardsController.listBoards)

module.exports = router