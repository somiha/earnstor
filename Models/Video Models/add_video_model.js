const DB = require("../../Utils/db_connection");

module.exports = class AddVideo {
  static async AddVideos(videos, point) {
    try {
      for (const video of videos) {
        const [result] = await DB.execute(
          "INSERT INTO videos(videoUrl, point) VALUES (?, ?)",
          [video, point]
        );
      }
    } catch (error) {
      return false;
    } finally {
      return true;
    }
  }
};
