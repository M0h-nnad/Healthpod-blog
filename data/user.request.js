const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Post = require("./posts.request");

const createUser = async (req, res, next) => {
  let {
    email,
    specialty,
    firstName,
    lastName,
    password,
    yearsOfExperience,
  } = req.body;
  await User.findOne({ email }).then((userDoc) => {
    if (userDoc) {
      res.status(400).json({ massage: "email is already exist" });
      next();
    }
    return bcrypt.hash(password, 12).then((hashedpassword) => {
      let newUser = new User({
        email,
        specialty,
        firstName,
        lastName,
        password: hashedpassword,
        yearsOfExperience,
      });
      newUser.save().then(() => {
        const token = jwt.sign(
          { email, id: newUser._id },
          "knsdfs_DSFASD2@#@swlfsljsaf;#@$#%%&%^&%$^*&^prfsodff",
          { expiresIn: "1h" }
        );
        return res
          .set({"token":token,'expiresin': 3600})
          .status(201)
          .send({ newUser });
      });
    });
  });
};

const UpdateUser = async (req, res, next) => {
  let password = req.body.password;
  const id = req.params.id;
  if (!id) {
    return res.status(404).json({ massage: "User Not Found" });
  }
  if (req.body.photo !== "null") {
    const url = req.protocol + "://" + req.get("host");
    req.body["ImagePath"] = url + "/images/" + req.file.filename;
  }
  const user = await User.findById(id);
  bcrypt.compare(password, user.password, async (err, result) => {
    if (result) {
      return bcrypt.hash(password, 12).then(async (hashedpassword) => {
        req.body.password = hashedpassword;
        let UpdateUser = await User.findByIdAndUpdate(
          { _id: id },
          {
            $set: req.body,
          },
          { new: true }
        );

        return UpdateUser.save((err) => {
          if (err) {
            return res.status(500).json(err);
          }
          return res
            .status(200)
            .json({ massage: "User Updated", userDoc: UpdateUser });
        });
      });
    }
    let UpdateUser = await User.findByIdAndUpdate(
      { _id: id },
      {
        $set: req.body,
      },
      { new: true }
    );
    return UpdateUser.save((err) => {
      if (err) {
        res.status(500).json(err);
        return next();
      }
      res.status(200).json({ massage: "User Updated", userDoc: UpdateUser });
      next();
    });
  });
};

const LogIn = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email })
    .then((userDoc) => {
      if (!userDoc) {
        return res.status(401).json({ massage: "the email not exist" });
      }
      bcrypt
        .compare(password, userDoc.password)
        .then((result) => {
          if (!result) {
            return res.status(401).json({ massage: "the password is wrong" });
          }
          const token = jwt.sign(
            { email, id: userDoc._id },
            "knsdfs_DSFASD2@#@swlfsljsaf;#@$#%%&%^&%$^*&^prfsodff",
            { expiresIn: "1h" }
          );
          res.set({ token: token, expiresIn: 3600 }).status(200).json({
            userDoc,
            massage: "SuccsesFull Login",
          });
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      res.send(err);
    });
};

const LogOut = (req, res, next) => {
  req.session.destroy((err) => {
    res.send({ massage: "Good Bye" });
  });
};

const getUser = async (req, res, next) => {
  let user = await User.find({ _id: req.params.id });
  if (!user) {
    return res.status(404).json({ massage: "User Not Found !!!" });
  }
  res.status(200).send(user);
  next();
};

const getUsers = async (req, res, next)=>{
  let Users = await User.find({})
  res.status(200).json(Users);
  next();
}

exports.createUser = createUser;
exports.LogIn = LogIn;
exports.Logout = LogOut;
exports.UpdateUser = UpdateUser;
exports.getUser = getUser;
exports.getUsers = getUsers;
