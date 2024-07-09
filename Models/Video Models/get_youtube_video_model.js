const DB = require("../../Utils/db_connection");
module.exports = class GetVideosModel {
  static GetAllVideos() {
    return DB.execute("SELECT * FROM youtube_video WHERE status = 1");
  }
};
