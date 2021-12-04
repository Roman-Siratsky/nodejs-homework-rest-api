const mongoose = require("mongoose")

const Task = new mongoose.Schema({
  title: { type: String, required: true},
  description: { type: String, required: true, default: "" },
  priority: { type: String, required: true },
  boardId: { type: mongoose.SchemaTypes.ObjectId, required: true, ref: 'Board'},
  userId: {type: mongoose.SchemaTypes.ObjectId, required: true, ref: 'User'}
})

module.exports = mongoose.model('Task', Task)