const mongoose = require("mongoose")
const Task = require("./taskScheme")

const Board = new mongoose.Schema({
  title: { type: String, required: true},
  items: { type: Array, required: true, default: [] },
})

module.exports = mongoose.model('Board', Board)