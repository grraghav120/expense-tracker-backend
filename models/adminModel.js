const mongoose = require('mongoose');

const adminModel=mongoose.Schema({
    email:({type:String}),
    password:({type:String}),
    createdAt:({type:String}),
});

module.exports=mongoose.model('AdminModel',adminModel);