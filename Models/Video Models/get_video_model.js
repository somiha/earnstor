const DB = require("../../Utils/db_connection");
module.exports = class GetVideosModel {
  static GetAllVideos() {
    return DB.execute("SELECT * FROM videos WHERE status = 1");
  }
};

module.exports = class GetYoutibeVideosModel {
  static GetAllYoutubeVideos() {
    return DB.execute("SELECT * FROM youtube_video");
  }
};
