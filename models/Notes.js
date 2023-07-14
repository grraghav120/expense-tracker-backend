const mongoose = require("mongoose");

const createNote = mongoose.Schema({
  content: { type: String, required: true },
  creater:{type:mongoose.Schema.Types.ObjectId,ref:"NotesUser",required:true},
});

module.exports = mongoose.model("CreateNote", createNote); //here first arg is must start with Capital
