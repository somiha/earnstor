require("dotenv").config();
const db = require("../../Utils/db_connection");
const { queryAsync, queryAsyncWithoutValue } = require("../../Utils/helper");
const baseUrl = process.env.baseUrl;

exports.getAllVideos = async (req, res, next) => {
  try {
    const videoQuery = `SELECT * FROM videos`;
    const videos = await queryAsyncWithoutValue(videoQuery);
    console.log("videos", videos);

    for (let video of videos) {
      const totalEarn = `SELECT SUM(points) as total FROM video_seen WHERE video_id = ?`;
      const result = await queryAsync(totalEarn, [video.id]);
      video.totalEarned = result[0].total;
    }

    console.log(videos);

    const page = parseInt(req.query.page) || 1;
    const videosPerPage = 8;
    const startIdx = (page - 1) * videosPerPage;
    const endIdx = startIdx + videosPerPage;
    const paginatedVideos = videos.slice(startIdx, endIdx);
    return res.status(200).render("pages/allVideos", {
      title: "All Videos",
      videos,
      paginatedVideos,
      videosPerPage,
      page,
    });
  } catch (e) {
    console.log(e);
    return res.status(503).json({ msg: "Internal Server Error" });
  }
};

exports.postVideo = async (req, res, next) => {
  try {
    const video = req.file && req.file.filename;
    const point = req.body.point;

    console.log("baseUrl", baseUrl);

    console.log("video", video);

    if (video && video.length > 0) {
      const videoUrl = `${baseUrl}/uploads/${video}`;
      console.log("videoUrl", videoUrl);
      const insertVideoQuery =
        "INSERT INTO videos (videoUrl, point) VALUES (?, ?)";
      const videoValues = [videoUrl, point];
      console.log("values", videoValues);

      await queryAsync(insertVideoQuery, videoValues);
      return res.redirect("/videos");
    } else {
      return res.status(400).json({ msg: "Video is required" });
    }
  } catch (e) {
    console.log(e);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

// exports.postVideo = async (req, res, next) => {
//   try {
//     const video = req.body.video;
//     const point = req.body.point;

//     const insertVideoQuery =
//       "INSERT INTO videos (videoUrl, point) VALUES (?, ?)";
//     const videoValues = [video, point];

//     await queryAsync(insertVideoQuery, videoValues);
//     return res.redirect("/videos");
//   } catch (e) {
//     console.log(e);
//     return res.status(500).json({ msg: "Internal Server Error" });
//   }
// };

exports.deleteVideo = async (req, res, next) => {
  try {
    const videoId = req.query.id;

    const deleteVideoQuery = "DELETE FROM videos WHERE id = ?";
    const videoValues = [videoId];

    await queryAsync(deleteVideoQuery, videoValues);

    return res.redirect("/videos");
  } catch (e) {
    console.log(e);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

exports.update_status = async (req, res, next) => {
  try {
    const videoId = req.query.id;
    const status = req.query.status;

    const updateStatusQuery = "UPDATE videos SET status = ? WHERE id = ?";
    const videoValues = [status, videoId];

    await queryAsync(updateStatusQuery, videoValues);

    return res.redirect("/videos");
  } catch (e) {
    console.log(e);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};
