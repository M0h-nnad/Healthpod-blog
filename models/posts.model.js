const mongoose = require("mongoose");
const { Mixed, Schema } = require("mongoose");

const postShema = mongoose.Schema({
  authorId:{ type:mongoose.Schema.Types.ObjectId, require:true},
  ImagePath: { type: String },
  title: { type: String },
  content: { type: String },
  tags: Mixed,
  date: { type: Date, default: Date.now },
  comments: { type: Array },
  published: { type: Boolean, default: false },
});

module.exports = mongoose.model("Post", postShema);
