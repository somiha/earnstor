const VideoModel = require("../../Models/Video Models/get_video_model");
exports.GetVideos = (req, res, next) => {
  VideoModel.GetAllVideos()
    .then((videos) => {
      let data = {
        status: "Success",
        messege: "Videos given Below",
        videos: videos[0],
      };
      res.status(200).json(data);
    })
    .catch((error) => {
      console.log(error);
    });
};

exports.GetYoutubeVideos = (req, res, next) => {
  VideoModel.GetAllYoutubeVideos()
    .then((videos) => {
      let data = {
        status: "Success",
        messege: "Youtube Videos given Below",
        videos: videos[0],
      };
      res.status(200).json(data);
    })
    .catch((error) => {
      console.log(error);
    });
};
