// Imports
const express = require("express");
const LeaderBoardController = require("../Controllers/General Controller/get_leaderboard_controller");
const EditGeneralController = require("../Controllers/General Controller/edit_general_controller");
const GetGeneralInfos = require("../Controllers/General Controller/get_general_controller");
const GetBanner = require("../Controllers/General Controller/banner_controller");
const GetOperator = require("../Controllers/General Controller/operator_controller.js");

// Use of express Router
const router = express.Router();

// Routes
router.get("/get-leaderboard", LeaderBoardController.GetLeaderBoard);
router.get("/general-info", GetGeneralInfos.GetGeneralInfo);
router.get("/banner", GetBanner.getBanner);
router.get("/operator", GetOperator.getOperator);
router.post("/general-info", EditGeneralController.EditGeneralInfo);

// Exports
module.exports = router;
