const mongoose =  require('mongoose');

const Comment = mongoose.Schema({
  postId:{type:String , required:true},
  authorEmail:{type:String, required:true},
  body:{type:String , required:true},
})

module.exports = mongoose.model('Comment', Comment);
