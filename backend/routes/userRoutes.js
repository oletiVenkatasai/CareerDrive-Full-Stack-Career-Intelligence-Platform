const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const { getProfile, updateProfile, updateSkills, uploadResume } = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, req.user.id + '-' + Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);
router.put("/skills", protect, updateSkills);
router.post("/upload-resume", protect, upload.single('resume'), uploadResume);

module.exports = router;
