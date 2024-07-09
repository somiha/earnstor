const DB = require("../../Utils/db_connection");

module.exports = class AddYoutubeVideo {
  static async AddYoutubeVideos(videos, point) {
    try {
      for (const video of videos) {
        console.log(1, video, point);
        const [result] = await DB.execute(
          "INSERT INTO youtube_video(video_url, points) VALUES (?, ?)",
          [video, point]
        );
      }
    } catch (error) {
      return console.log(error);
    } finally {
      return true;
    }
  }
};
