const mongoose = require('mongoose');

const userFeedback=mongoose.Schema({
    userId:({type:String}),
    email:({type:String}),
    rating:({type:Number}),
    reason:({type:Number}),
    createdAt:({type:String}),
});

module.exports=mongoose.model('UserFeedback',userFeedback);