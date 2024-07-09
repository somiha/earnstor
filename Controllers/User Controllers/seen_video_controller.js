const db = require("../../Utils/db_connection");
const { queryAsync, queryAsyncWithoutValue } = require("../../Utils/helper");

exports.getVideos = async (req, res, next) => {
  try {
    console.log("here");
    let userId = req.query.user_id;
    const getSeenVideosQuery = `SELECT * FROM videos WHERE id IN (SELECT video_id FROM video_seen WHERE user_id = ?) AND status = 1`;
    const getUnseenVideosQuery = `SELECT * FROM videos WHERE id NOT IN (SELECT video_id FROM video_seen WHERE user_id = ?) AND status = 1`;

    const seenVideos = await queryAsync(getSeenVideosQuery, [userId]);
    const unseenVideos = await queryAsync(getUnseenVideosQuery, [userId]);

    return res.status(200).json({ seenVideos, unseenVideos });
  } catch (err) {
    console.log(err);
    return res.status(503).json({ msg: "Internal Server Error" });
  }
};

exports.getYoutubeVideos = async (req, res, next) => {
  try {
    console.log("here");
    let userId = req.query.user_id;
    const getSeenVideosQuery = `SELECT * FROM youtube_video WHERE id IN (SELECT youtube_video_id FROM youtube_video_seen WHERE user_id = ?) AND status = 1`;
    const getUnseenVideosQuery = `SELECT * FROM youtube_video WHERE id NOT IN (SELECT youtube_video_id FROM youtube_video_seen WHERE user_id = ?) AND status = 1`;

    const seenVideos = await queryAsync(getSeenVideosQuery, [userId]);
    const unseenVideos = await queryAsync(getUnseenVideosQuery, [userId]);

    return res.status(200).json({ seenVideos, unseenVideos });
  } catch (err) {
    console.log(err);
    return res.status(503).json({ msg: "Internal Server Error" });
  }
};

exports.addSeenVideo = async (req, res, next) => {
  try {
    let userId = req.query.user_id;
    let videoId = req.query.video_id;

    const checkVideoQuery = `SELECT * FROM videos WHERE id = ?`;
    const video = await queryAsync(checkVideoQuery, [videoId]);
    console.log(video[0]);
    if (!video[0]) {
      return res.status(400).json({ msg: "No video found with this id" });
    }
    const checkSeenVideoQuery = `SELECT * FROM video_seen WHERE user_id = ? AND video_id = ?`;
    const seenVideo = await queryAsync(checkSeenVideoQuery, [userId, videoId]);

    if (!seenVideo[0]) {
      const addSeenVideoQuery = `INSERT INTO video_seen (user_id, video_id, points) VALUES (?, ?, ?)`;
      await queryAsync(addSeenVideoQuery, [userId, videoId, video[0].point]);
      // add point to user table
      const addPointQuery = `UPDATE users SET point = point + ? WHERE userid = ?`;
      await queryAsync(addPointQuery, [video[0].point, userId]);
    } else {
      const addSeenVideoQuery = `INSERT INTO video_seen (user_id, video_id, points) VALUES (?, ?, ?)`;
      await queryAsync(addSeenVideoQuery, [userId, videoId, 0]);
    }

    // const selectPoint = `SELECT * FROM type WHERE type_name = 'video'`;
    // const point = await queryAsyncWithoutValue(selectPoint);
    // const earnHistoryQuery = `INSERT INTO earn_history (user_id, type_id) VALUES (?, ?)`;
    // await queryAsync(earnHistoryQuery, [userId, point[0].points, point[0].id]);
    // const addPointQuery = `UPDATE users SET point = point + ? WHERE userid = ?`;
    // await queryAsync(addPointQuery, [point[0].points, userId]);

    return res.status(200).json({ msg: "Video added to seen list" });
  } catch (err) {
    console.log(err);
    return res.status(503).json({ msg: "Internal Server Error" });
  }
};

exports.addSeenYoutubeVideo = async (req, res, next) => {
  try {
    let userId = req.query.user_id;
    let videoId = req.query.video_id;

    const checkVideoQuery = `SELECT * FROM youtube_video WHERE id = ?`;
    const video = await queryAsync(checkVideoQuery, [videoId]);
    console.log(video[0]);
    if (!video[0]) {
      return res.status(400).json({ msg: "No video found with this id" });
    }
    const checkSeenVideoQuery = `SELECT * FROM youtube_video_seen WHERE user_id = ? AND youtube_video_id = ?`;
    const seenVideo = await queryAsync(checkSeenVideoQuery, [userId, videoId]);

    if (!seenVideo[0]) {
      const addSeenVideoQuery = `INSERT INTO youtube_video_seen (user_id, youtube_video_id, points) VALUES (?, ?, ?)`;
      await queryAsync(addSeenVideoQuery, [userId, videoId, video[0].points]);
      const addPointQuery = `UPDATE users SET point = point + ? WHERE userid = ?`;
      await queryAsync(addPointQuery, [video[0].points, userId]);
    } else {
      const addSeenVideoQuery = `INSERT INTO youtube_video_seen (user_id, youtube_video_id, points) VALUES (?, ?, ?)`;
      await queryAsync(addSeenVideoQuery, [userId, videoId, 0]);
    }
    // const selectPoint = `SELECT * FROM type WHERE type_name = 'youtube video'`;
    // const point = await queryAsyncWithoutValue(selectPoint);
    // console.log(point[0].points);
    // const earnHistoryQuery = `INSERT INTO earn_history (user_id, point, type_id) VALUES (?, ?, ?)`;
    // await queryAsync(earnHistoryQuery, [userId, point[0].points, point[0].id]);

    // const addPointQuery = `UPDATE users SET point = point + ? WHERE userid = ?`;
    // await queryAsync(addPointQuery, [point[0].points, userId]);

    return res.status(200).json({ msg: "Video added to seen list" });
  } catch (err) {
    console.log(err);
    return res.status(503).json({ msg: "Internal Server Error" });
  }
};
