const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = mongoose.Schema({
  email: { type: String, required: true },
  ImagePath: { type: String },
  specialty: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  password: { type: String, required: true },
  bio: { type: String},
  facebookLink: { type: String},
  instagramLink: { type: String},
  twitterLink: { type: String},
  websiteLink: { type: String},
  yearsOfExperience: { type: Number, required: true },
  posts: [{ type: Schema.Types.ObjectId, ref: "Post" }],
});

module.exports = mongoose.model("User", userSchema);
