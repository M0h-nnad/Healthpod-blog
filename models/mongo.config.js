const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost:27017/healthpod-blog", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(console.log("connected to db"))
  .catch((Err) => console.log(Err));

module.exports = mongoose;
