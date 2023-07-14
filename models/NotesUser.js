const mongoose = require("mongoose");
// const createNote=require('./Notes')
const uniqueValidator = require("mongoose-unique-validator");

const createNote = mongoose.Schema({
    content: { type: String, required: true },
    creater:{type:mongoose.Schema.Types.ObjectId,ref:"NotesUser",required:true},
  });

const NotesUser = mongoose.Schema({
//   name: { type: String, required: true },
  username: { type: String, required: true },
  gmail: { type: String, required: true, unique: true }, //not works as a validator so we import mongoose-unique-validator
  password: { type: String, required: true },
  confirmPassword:{type:String,required:true},
  userData:[createNote],
});

userSchmema.plugin(uniqueValidator);

module.exports = mongoose.model("NotesUser", NotesUser);
