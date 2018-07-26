const multer = require("multer");
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

  //config
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
  
module.exports = multer({ storage: storage, limits }).single("image");
/**END MULTER */
