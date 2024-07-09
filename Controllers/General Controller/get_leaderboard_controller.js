const LeaderBoardModel = require("../../Models/General Models/get_leaderboard_model");
exports.GetLeaderBoard = (req, res, next) => {
  LeaderBoardModel.GetLeaderBoard()
    .then((result) => {
      let data = {
        status: "Success",
        messege: "Leaderboard given Below",
        leaderBoard: result[0],
      };
      res.status(200).json(data);
    })
    .catch((error) => {
      console.log(error);
    });
};
