const express = require("express");
const router = express.Router();
const postsController = require("../controllers/posts");
const multer = require("multer");
const checkAuth = require("../middleware/check-auth");

/**
 * Multer
 */
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
  
var uploadFile = multer({ storage: storage, limits }).single("image");
/**END MULTER */

//Create post
router.post("",checkAuth, uploadFile, postsController.createPost);

//Get posts
router.get("", postsController.getPosts);

//Get post
router.get("/:id, postsController.getPost");

//Update post
router.put(
  "/:id",
  checkAuth, 
  uploadFile,
  postsController.updatePost
);

//DELETE post
router.delete("/:id", checkAuth, postsController.deletePost);

module.exports = router;
