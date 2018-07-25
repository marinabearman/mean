const express = require("express");
const multer = require("multer");

const Post = require("../models/post");
const checkAuth = require("../middleware/check-auth");

const router = express.Router();

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg"
};
const FILE_SIZE = {
  testing: 834714,
  production: 1073741824 // 1GB
}

const FILE_SIZE_MAX = FILE_SIZE.production;
const limits = {
  fileSize: FILE_SIZE_MAX
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {

    const isValid = MIME_TYPE_MAP[file.mimetype];

    let error = new Error("Invalid mime type");
    if (isValid) {
      error = null;
    }
    cb(error, "backend/images");
  },
  filename: (req, file, cb) => {
    const name = file.originalname
      .toLowerCase()
      .split(" ")
      .join("-");
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + "-" + Date.now() + "." + ext);
  }
});

var upload = multer({ storage: storage, limits }).single("image");

router.post(
  "",
  checkAuth, // pass the function, don't execute, express will do that when it reaches this request
  upload,
  (req, res, next) => {
    const url = req.protocol + "://" + req.get("host");
    const post = new Post({
      title: req.body.title,
      content: req.body.content,
      imagePath: url + "/images/" + req.file.filename,
      creator: req.userData.userId
    });
    // console.log(req.userData);
    // return res.status(200).json({

    // });
    post.save().then(createdPost => {
      res.status(201).json({
        message: "Post added successfully",
        post: {
          ...createdPost,
          id: createdPost._id
        }
      });
    })
    .catch(error => {
      res.status(500).json({
        message: "Creating a post failed!"
      })
    });
  }
);

//Update
router.put(
  "/:id",
  checkAuth, 
  upload,
  (req, res, next) => {
    let imagePath = req.body.imagePath;
    if (req.file) {
      const url = req.protocol + "://" + req.get("host");
      imagePath = url + "/images/" + req.file.filename;

    }
    const post = new Post({
      _id: req.body.id,
      title: req.body.title,
      content: req.body.content,
      imagePath: imagePath,
      creator: req.userData.userid
    });
    //console.log(post);
    Post.updateOne({ _id: req.params.id, creator: req.userD
    .userId }, post).then(result => {
      if (result.nModified > 0) {
        res.status(200).json({ message: "Update successful!" });
      } else {
        res.status(401).json({ message: "Not Authorized!" });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: "Couldn't update post!"
      })
    });
  }
);

//DELETE

router.delete("/:id", checkAuth, (req, res, next) => {
  Post.deleteOne({ _id: req.params.id, creator: req.userData.userId }).then(result => {
    //console.log(result);
    if (result.n > 0) {
      res.status(200).json({ message: "Post deleted!" });
    } else {
      res.status(401).json({ message: "Not Authorized!" });
    }
  })
  .catch(error => {
    res.status(500).json({
      message: "Fetching post failed!"
    });
  });
});

router.get("", (req, res, next) => {
  //  console.log(req.query);
  //Create query parameters
  //localhost:3000/api/posts?pageSize=2&page=1;
  // + converts to numbers

  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const postQuery = Post.find();

  let fetchedPosts;

  if (pageSize && currentPage) {

    postQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }

  postQuery.then(documents => {
    fetchedPosts = documents;
    return Post.count();
  })
  .then(count => {
    res.status(200).json({
      message: "Posts fetched successfully!",
      posts: fetchedPosts,
      maxPosts: count
    });
  })
  .catch(error => {
    res.status(500).json({
      message: "Post not found!"
    });
  })
});

router.get("/:id", (req, res, next) => {
  Post.findById(req.params.id).then(post => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({ message: "Post not found!" });
    }
  })
  .catch(error => {
      res.status(500).json({
        message: "Fetching post failed!"
      });
    });
});



module.exports = router;
