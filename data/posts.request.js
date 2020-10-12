const User = require("../models/user.model");
const Post = require("../models/posts.model");

exports.CreatePost = async (req, res, next) => {
  const authorId = req.body.authorId;
  if (authorId) {
    if (req.body.photo !== "null") {
      const url = req.protocol + "://" + req.get("host");
      req.body["ImagePath"] = url + "/images/" + req.file.filename;
    }
    req.body.tags = JSON.parse(req.body.tags);
    let newPost = await new Post(req.body);
    newPost.save(() => {
      User.updateOne(
        { _id: authorId },
        { $addToSet: { posts: newPost._id } },
        { new: true }
      ).then(() => {
        res.status(201).json({ newPost, massage: "Post Added" });
        next();
      });
    });
  }
};

exports.GetAllPosts = async (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  let count = await Post.countDocuments({ published: true });
  if (pageSize >= 0 && currentPage>=0) {
    let Posts = await Post.find({ published: true }, {}, { sort: { _id: -1 } })
      .skip(pageSize * (currentPage - 1))
      .limit(pageSize);
    res.status(200).json({Posts,count});
    return next();
  }
  let Posts = await Post.find({ published: true }, {}, { sort: { _id: -1 } });
  res.status(200).json({Posts,count});
  next();
};

exports.DeletePost = (req, res, next) => {
  Post.deleteOne({ _id: req.params.id }).then((result) => {
    res
      .status(200)
      .json({ massage: "The Post Deleted !", deletedId: req.params.id });
    next();
  });
};

exports.getPost = async (req, res, next) => {
  await Post.findById(req.params.id).then((post) => {
    if (post) {
      const AuthorInfo = User.findById(post.authorId).then((author) => {
        res.status(200).json({ post, author });
        return next();
      });
    } else {
      res.status(404).json({ massage: "Post in not found" });
      next();
    }
  });
};

exports.UpdatePost = async (req, res, next) => {
  let ImagePath = req.body.ImagePath;
  if (req.body.photo !== "null") {
    const url = req.protocol + "://" + req.get("host");
    req.body["ImagePath"] = url + "/images/" + req.file.filename;
  }
  req.body.tags = JSON.parse(req.body.tags);
  let updatePost = await Post.findByIdAndUpdate(
    { _id: req.params.id },
    { $set: req.body },
    { new: true }
  );
  return updatePost.save((err) => {
    console.log(err);
    res.status(200).json({ updatePost, massage: "Post Is Updated" });
    next();
  });
};

exports.getUserPosts = async (req, res, next) => {
  const Posts = [];
  const authorId = req.params.id;
  const user = await User.findById(authorId);
  if (!user) {
    return res.status(404);
  }
  PostsIds = user.posts;
  if (!PostsIds) {
    return;
  }
  for (id of PostsIds) {
    let post = await Post.findById(id);
    if (post === null) {
      await User.findByIdAndUpdate({ _id: authorId }, { $pull: { posts: id } });
      continue;
    }
    Posts.push(post);
  }
  res.status(200).json(Posts);
};

exports.publishPost = async (req, res, next) => {
  const id = req.params.id;
  let publishState = req.body.publishState;
  publishState = !publishState;
  let UpdatedPost = await Post.findByIdAndUpdate(
    { _id: id },
    { $set: { published: publishState } },
    { new: true }
  );
  UpdatedPost.save((err) => {
    if (err) {
      return res.status(500).json({ massage: err });
    }
    if (!publishState) {
      res.status(200).json({ massage: "Post UnPublished !!!" });
      return next();
    }
    res.status(200).json({ massage: "Post Published !!!" });
    next();
  });
};
