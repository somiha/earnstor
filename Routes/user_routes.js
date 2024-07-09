// Imports
const express = require("express");
const multer = require("multer");
const registerController = require("../Controllers/User Controllers/register_controller");
const loginController = require("../Controllers/User Controllers/login_controller");
const forgotPasswordController = require("../Controllers/User Controllers/forgot_pass_controller");
const editUserController = require("../Controllers/User Controllers/edit_user_controller");
const userImageController = require("../Controllers/User Controllers/user_image_controller");
const getUserController = require("../Controllers/User Controllers/get_user_controller");
const GetReferController = require("../Controllers/User Controllers/get_refers_controller");
const AddWithdrawModel = require("../Controllers/User Controllers/add_withdraw_controller");
const GetWithdrawModel = require("../Controllers/User Controllers/get_withdraw_controller");
const AddPointController = require("../Controllers/User Controllers/add_point_controller");
const verificationController = require("../Controllers/User Controllers/verification_controller");
const paymentController = require("../Controllers/User Controllers/payment_controller");
const pointController = require("../Controllers/User Controllers/point_type_controller");
const packageController = require("../Controllers/User Controllers/package_controller");
const forgotPassController = require("../Controllers/User Controllers/forgot_password_controller");
const AddWithdraw = require("../Controllers/User Controllers/withdraw_controller");
const help_center = require("../Controllers/User Controllers/help_center_controller");
const earn_history = require("../Controllers/User Controllers/earn_history_controller");
const payment_instruction = require("../Controllers/User Controllers/payment_instruction");
const payment_method = require("../Controllers/User Controllers/payment_method");
const recharge = require("../Controllers/User Controllers/recharge_controller");
const online_course = require("../Controllers/User Controllers/online_course");
const pdf = require("../Controllers/User Controllers/pdf_controller");
const hotel = require("../Controllers/User Controllers/hotel_controller");
const country = require("../Controllers/User Controllers/country_controller");
const hotel_room = require("../Controllers/User Controllers/hotel_room_controller");
const agency = require("../Controllers/User Controllers/agency_controller");
const post = require("../Controllers/User Controllers/add_post_controller");
const blood_group = require("../Controllers/User Controllers/blood_group_controller");
const donor = require("../Controllers/User Controllers/donor_controller");
const donation = require("../Controllers/User Controllers/donation_controller");
const multiUpload = require("../middleware/multiupload");

// Use of express Router
const router = express.Router();

// Multer Setup

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log("file", file);
    cb(null, "public/uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// Routes
router.get("/get-user", getUserController.GetUser);
router.post("/register", registerController.Register);
router.post("/verification", verificationController.verification);
router.post("/resend-verification", verificationController.resend_verification);
router.post("/login", loginController.Login);
router.post("/forgot-pass", forgotPasswordController.ForgotPassword);

router.patch("/edit-user", editUserController.EditUser);
router.patch(
  "/user-pic",
  upload.single("image"),
  userImageController.SetUserImage
);
router.get("/get-refers", GetReferController.GetRefers);
router.post("/withdraw", AddWithdrawModel.AddWithdraw);
router.get("/withdraw", GetWithdrawModel.GetWithdraw);
router.post("/add-point", AddPointController.AddPoint);
router.post("/add-package", packageController.addPackage);

router.post("/add-payment", paymentController.add_payment);

router.post("/add-point-type", pointController.addPointType);

router.get("/get-point-type", pointController.getPointTypes);

router.get("/get-registration-fees", packageController.getRegistrationFees);

router.post("/forgot-password", forgotPassController.forgot_password);

router.post("/add-withdraw", AddWithdraw.add_withdraw);

router.post("/add-help-center", help_center.add_help_center);
router.get("/get-help-center", help_center.get_help_center);
router.get("/get-earn-history", earn_history.getEarnHistory);

router.post(
  "/add-payment-instruction",
  payment_instruction.add_payment_instruction
);
router.get(
  "/get-payment-instruction",
  payment_instruction.get_payment_instruction
);

router.post(
  "/add-payment-method",
  upload.fields([{ name: "logo" }]),
  payment_method.add_payment_method
);
router.get("/get-payment-method", payment_method.get_payment_method);

router.post("/add-recharge", recharge.add_recharge);
router.get("/get-recharge", recharge.get_recharge);

router.post(
  "/add-online-course",
  upload.fields([{ name: "icon" }]),
  online_course.online_course
);
router.get("/get-online-course", online_course.get_online_course);

router.post("/add-pdf", upload.fields([{ name: "image" }]), pdf.pdf);
router.get("/get-pdf", pdf.get_pdf);

router.post("/add-hotel", upload.fields([{ name: "image" }]), hotel.add_hotel);
router.get("/get-all-hotel", hotel.get_hotel);

router.get("/get-hotel/:id", hotel.get_hotel_by_id);

router.get("/get-hotel-room/:id", hotel.get_hotel_room_by_id);

router.post("/add-country", country.country);
router.get("/get-country", country.get_country);

router.post(
  "/add-hotel-room",
  upload.fields([{ name: "image" }]),
  hotel_room.add_hotel_room
);

router.post(
  "/upload-hotel-room-images",
  multiUpload.fields([{ name: "hotel-room-images" }]),
  hotel_room.upload_hotel_room_images
);

router.post("/book-hotel-room", hotel_room.book_hotel_room);
router.get("/get-book-hotel-rooms", hotel_room.get_booked_hotel_rooms);

router.post(
  "/add-agency",
  upload.fields([{ name: "image" }]),
  hotel.add_agency
);

router.get("/get-agencys", hotel.get_agencys);

router.get("/get-hotel-room", hotel_room.get_hotel_rooms);

router.post(
  "/add-agency-package",
  upload.fields([{ name: "image" }]),
  agency.add_agency_package
);

router.get("/get-agency-package", agency.get_agency_package);

router.post("/book-agency-package", agency.book_agency);
router.get("/get-book-agency-package", agency.get_booked_agency_package);

router.post(
  "/add-post",
  upload.fields([{ name: "image" }, { name: "video" }]),
  post.add_post
);

router.post(
  "/add-comment",
  upload.fields([{ name: "image" }]),
  post.add_comment
);

router.post("/add-like", post.add_like);

router.get("/get-comments-user-id", post.get_comments_by_user_id);

router.get("/get-posts", post.get_post);

router.get("/get-likes-user-id", post.get_likes_by_user_id);

router.get("/get-comments-post-id", post.get_comments_by_post_id);

router.get("/get-likes-post-id", post.get_likes_by_post_id);

router.post("/delete-comment", post.delete_comment);

router.post("/delete-like", post.delete_like);

router.post("/delete-post", post.delete_post);

router.post("/add-blood-group", blood_group.blood_group);
router.get("/get-blood-group", blood_group.get_blood_group);

router.post("/add-upazila", blood_group.upazila);
router.get("/get-upazila", blood_group.get_upazila);

router.post("/add-district", blood_group.district);
router.get("/get-district", blood_group.get_district);

router.post("/add-division", blood_group.division);
router.get("/get-division", blood_group.get_division);

router.post("/add-donor", upload.fields([{ name: "image" }]), donor.add_donor);

router.post(
  "/edit-donor",
  upload.fields([{ name: "image" }]),
  donor.edit_donor
);

router.get("/get-donor", donor.get_donor);

router.get("/get-donor-blood-group", donor.get_donor_blood_group);

router.post("/add-donation-by-user", donation.add_donation_by_user);

router.post("/add-donation-by-admin", donation.add_donation_by_admin);

router.get("/get-recent-donation", donation.get_recent_donations);

// Exports
module.exports = router;
