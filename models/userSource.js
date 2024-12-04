const mongoose = require('mongoose');

const userSource=mongoose.Schema({
    email:({type:String}),
    source:({type:String}),
    action:({type:String}),
    createdAt:({type:String}),
});

module.exports=mongoose.model('UserSource',userSource);