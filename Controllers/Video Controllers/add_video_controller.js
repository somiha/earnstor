const AddVideoModel = require("../../Models/Video Models/add_video_model");
const AddYoutubeVideoModel = require("../../Models/Video Models/add_youtube_video_model");
exports.AddVideo = async (req, res, next) => {
  const videoUrls = req.body.videoUrls || [];
  const point = req.body.point;
  let checker = await AddVideoModel.AddVideos(videoUrls, point);
  if (checker) {
    let data = {
      status: "Success",
      messege: "Added given Below",
      videos: videoUrls,
    };
    res.status(200).json(data);
  } else {
    let data = {
      status: "Failed",
      messege: "Failed to added video",
      videos: [],
    };
    res.status(400).json(data);
  }
};

exports.AddYoutubeVideo = async (req, res, next) => {
  const videoUrls = req.body.videoUrls || [];
  const point = req.body.point;
  let checker = await AddYoutubeVideoModel.AddYoutubeVideos(videoUrls, point);
  if (checker) {
    let data = {
      status: "Success",
      messege: "Added given Below",
      videos: videoUrls,
    };
    res.status(200).json(data);
  } else {
    let data = {
      status: "Failed",
      messege: "Failed to added video",
      videos: [],
    };
    res.status(400).json(data);
  }
};
