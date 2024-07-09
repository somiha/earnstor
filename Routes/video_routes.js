// Imports
const express = require("express");
const { body } = require("express-validator");
const addVideoController = require("../Controllers/Video Controllers/add_video_controller");

const GetVideoController = require("../Controllers/Video Controllers/get_video_controller");
const {
  getVideos,
  addSeenVideo,
  getYoutubeVideos,
  addSeenYoutubeVideo,
} = require("../Controllers/User Controllers/seen_video_controller");

// Use of express Router
const router = express.Router();

// Routes
router.get("/get-videos", getVideos);
router.post("/add-seen-video", addSeenVideo);

router.get("/get-youtube-videos", getYoutubeVideos);
router.post("/add-seen-youtube-video", addSeenYoutubeVideo);
router.post(
  "/add-video",
  body("videoUrls").optional().isArray(),
  addVideoController.AddVideo
);
router.post(
  "/add-youtube-video",
  body("videoUrls").optional().isArray(),
  addVideoController.AddYoutubeVideo
);

// Exports
module.exports = router;
