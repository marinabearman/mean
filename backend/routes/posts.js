const express = require("express");
const router = express.Router();
const postsController = require("../controllers/posts");
const checkAuth = require("../middleware/check-auth");
const fileUpload = require("../middleware/file-upload");

//Create post
router.post("",checkAuth, fileUpload, postsController.createPost);

//Get posts
router.get("", postsController.getPosts);

//Get post
router.get("/:id", postsController.getPost);

//Update post
router.put(
  "/:id",
  checkAuth, 
  fileUpload,
  postsController.updatePost
);

//DELETE post
router.delete("/:id", checkAuth, postsController.deletePost);

module.exports = router;
