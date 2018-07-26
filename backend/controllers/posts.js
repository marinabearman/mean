const Post = require("../models/post");

//Create Post
exports.createPost =  
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

//Get posts
exports.getPosts = (req, res, next) => {
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
  }

  //Get post
  exports.getPost = (req, res, next) => {
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
  }

//Update post
exports.updatePost = (req, res, next) => {
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
    Post.updateOne({ _id: req.params.id, creator: req.userData
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

  //Delete post
  exports.deletePost =  (req, res, next) => {
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
  }

