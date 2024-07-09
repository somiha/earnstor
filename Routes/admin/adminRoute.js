const router = require("express").Router();
const {
  getAllUsers,
  deleteUser,
} = require("../../Controllers/admin/user_list_controller");
const {
  getAllVideos,
  postVideo,
  deleteVideo,
  update_status,
} = require("../../Controllers/admin/video_controller");

const {
  getAllYoutubeVideos,
  postYoutubeVideo,
  deleteYoutubeVideo,
  youtube_update_status,
} = require("../../Controllers/admin/youtube_video_controller");
const {
  getLeaderBoard,
} = require("../../Controllers/admin/leaderboard_controller");
const { getRefers } = require("../../Controllers/admin/refer_controller");
const {
  getAllPendingPayments,
  acceptPayment,
  rejectPayment,
} = require("../../Controllers/admin/payment_controller");

const {
  getSettings,
  updateHelpCenters,
  updateRegistrationFee,
  updateReferPoint,
  updateMinVideo,
} = require("../../Controllers/admin/settings_controller");

const {
  getWithdraw,
  updateStatus,
} = require("../../Controllers/admin/withdraw_controller");

const {
  getBreakingNews,
  updateBreakingNews,
} = require("../../Controllers/admin/breaking_news_controller");

const {
  getBanners,
  postBanner,
  updateBanner,
  deleteBanners,
} = require("../../Controllers/admin/bannerController");
const {
  getOperators,
  postOperator,
  updateOperator,
  deleteOperators,
} = require("../../Controllers/admin/operatorController");

const {
  getRecharge,
  updateRechargeStatus,
} = require("../../Controllers/admin/recharge_controller");

const {
  getLogin,
  postLogin,
  logOut,
} = require("../../Controllers/admin/authController");

const multerVideo = require("../../middleware/multerVideo");
const multiUpload = require("../../middleware/multiupload");
const adminAuth = require("../../middleware/adminAuth");

router.get("/", adminAuth, getAllUsers);
router.get("/delete-user", adminAuth, deleteUser);

router.get("/videos", adminAuth, getAllVideos);
// router.post("/add-videos", postVideo);
router.get("/delete-video", adminAuth, deleteVideo);
router.get("/update-status", adminAuth, update_status);

router.get("/youtube-videos", adminAuth, getAllYoutubeVideos);
router.post("/add-youtube-videos", adminAuth, postYoutubeVideo);
router.get("/delete-youtube-videos", adminAuth, deleteYoutubeVideo);
router.get("/youtube-update-status", adminAuth, youtube_update_status);

router.get("/leaderboard", adminAuth, getLeaderBoard);
router.get("/refers", adminAuth, getRefers);
router.get("/pending-payment", adminAuth, getAllPendingPayments);
router.get("/payment/accept/:paymentId", adminAuth, acceptPayment);
router.get("/payment/reject/:paymentId", adminAuth, rejectPayment);
router.post("/add-videos", adminAuth, multerVideo.single("video"), postVideo);

router.get("/withdraw-history", adminAuth, getWithdraw);
router.post("/withdraw-history/:id", adminAuth, updateStatus);

router.get("/recharge-history", adminAuth, getRecharge);
router.post("/recharge-history/:id", adminAuth, updateRechargeStatus);

router.get("/breaking-news", adminAuth, getBreakingNews);
router.post("/update-breaking-news", adminAuth, updateBreakingNews);

router.get("/settings", adminAuth, getSettings);
router.post("/update-helpcenter", adminAuth, updateHelpCenters);
router.post("/update-registration-fee", adminAuth, updateRegistrationFee);
router.post("/update-refer-point", adminAuth, updateReferPoint);
router.post("/update-min-video", adminAuth, updateMinVideo);

router.get("/banners", adminAuth, getBanners);
router.post(
  "/add-banners",
  multiUpload.fields([{ name: "banner-image" }]),
  adminAuth,
  postBanner
);
router.post(
  "/update-banners",
  multiUpload.fields([{ name: "banner-image" }]),
  adminAuth,
  updateBanner
);
router.post("/delete-banner", adminAuth, deleteBanners);

router.get("/operators", adminAuth, getOperators);
router.post(
  "/add-operators",
  multiUpload.fields([{ name: "operator-image" }]),
  adminAuth,
  postOperator
);
router.post(
  "/update-operators",
  multiUpload.fields([{ name: "operator-image" }]),
  adminAuth,
  updateOperator
);
router.post("/delete-operator", adminAuth, deleteOperators);

router.get("/admin/login", getLogin);
router.post("/admin/login", postLogin);
router.get("/admin/logout", adminAuth, logOut);

module.exports = router;
