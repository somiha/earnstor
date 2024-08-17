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
const online_tv = require("../Controllers/User Controllers/online_tv_controller");
const newspaper = require("../Controllers/User Controllers/newspaper_controller");
const category = require("../Controllers/User Controllers/category_controller");
const sport = require("../Controllers/User Controllers/sportUpdate");
const ad = require("../Controllers/User Controllers/ad_controller");
const profile = require("../Controllers/User Controllers/profile_update");
const food = require("../Controllers/User Controllers/food_controller");
const car = require("../Controllers/User Controllers/car_controller");
const percel_delivery = require("../Controllers/User Controllers/percel_delivery_controller");
const message = require("../Controllers/User Controllers/message_controller");
const hajj_agency = require("../Controllers/User Controllers/hajj_agency_controller");
const level = require("../Controllers/User Controllers/level_controller");
const book = require("../Controllers/User Controllers/book_controller");
const sport_news = require("../Controllers/User Controllers/sport_news_controller");
const quiz = require("../Controllers/User Controllers/quiz_controller");
const organization = require("../Controllers/User Controllers/organization_controller");
const chat = require("../Controllers/User Controllers/admin_chat");
const streaming_hub = require("../Controllers/User Controllers/streaming_hub");
const course_cat = require("../Controllers/User Controllers/course_cat");
const multiUpload = require("../middleware/multiupload");
const falshSell = require("../Controllers/User Controllers/ecom-controller");
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

router.post("/edit-user", upload.single("image"), editUserController.EditUser);
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

router.post("/buy-online-course", online_course.buy_online_course);
router.get("/get-online-course", online_course.get_online_course);

router.get("/get-buy-online-course", online_course.get_buy_online_course);

router.post(
  "/add-popular-course",
  upload.fields([{ name: "icon" }]),
  online_course.popular_course
);
router.get("/get-popular-course", online_course.get_popular_course);

router.post("/add-pdf", upload.fields([{ name: "image" }]), pdf.pdf);
router.get("/get-pdf", pdf.get_pdf);
router.get("/get-pdf-id", pdf.get_pdf_id);
router.post("/buy-pdf", pdf.buy_pdf);
router.get("/get-buy-pdf", pdf.get_buy_pdf);

router.post("/add-hotel", upload.fields([{ name: "image" }]), hotel.add_hotel);
router.post("/add-review", hotel.add_review);
router.get("/get-all-hotel", hotel.get_hotel);

router.get("/get-hotel", hotel.get_hotel_by_id);

router.get("/get-hotel-room", hotel.get_hotel_room_by_id);

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
router.get("/get-all-agency-package", agency.get_all_agency_package);
router.get("/get-agency-package-id", agency.get_agency_package_id);
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

router.get("/get-donor-id", donor.get_donor_by_id);

router.get("/get-donor-blood-group", donor.get_donor_blood_group);

router.post("/add-donation-by-user", donation.add_donation_by_user);

router.post("/add-donation-by-admin", donation.add_donation_by_admin);

router.get("/get-recent-donation", donation.get_recent_donations);

router.post(
  "/add-online-tv",
  upload.fields([{ name: "image" }]),
  online_tv.add_online_tv
);

router.get("/get-online-tv", online_tv.get_online_tv);

router.post("/delete-online-tv", online_tv.delete_online_tv);

router.post(
  "/add-newspaper",
  upload.fields([{ name: "image" }]),
  newspaper.add_newspaper
);

router.get("/get-newspaper", newspaper.get_newspaper);

router.post("/delete-newspaper", newspaper.delete_newspaper);

router.post(
  "/add-all-category",
  upload.fields([{ name: "image" }]),
  category.add_all_category
);

router.get("/get-all-category", category.get_all_category);

router.post("/delete-all-category", category.delete_all_category);

router.post(
  "/add-sub-category",
  upload.fields([{ name: "image" }]),
  category.add_sub_category
);

router.get("/get-sub-category", category.get_sub_category);

router.post("/delete-sub-category", category.delete_sub_category);

router.post(
  "/add-extra-category",
  upload.fields([{ name: "image" }]),
  category.add_extra_category
);

router.get("/get-extra-category", category.get_extra_category);

router.post("/delete-extra-category", category.delete_extra_category);

router.post("/add-sport-category", sport.addSportCategory);
router.post("/update-sport-category", sport.updateSportCategory);
router.post("/delete-sport-category", sport.deleteSportCategory);
router.get("/get-sport-category", sport.getAllSportCategory);

router.post("/add-team", upload.fields([{ name: "image" }]), sport.addTeam);
router.post(
  "/update-team",
  upload.fields([{ name: "image" }]),
  sport.updateTeam
);
router.post("/delete-team", sport.deleteTeam);
router.get("/get-teams", sport.getTeam);

router.post("/add-sport-update", sport.addSportUpdate);

router.get("/get-sport-updates", sport.getAllSportUpdates);

router.post("/ad-package", ad.ad_package);

router.get("/get-ad-package", ad.get_ad_package);

router.post(
  "/ad-category",
  upload.fields([{ name: "image" }]),
  ad.add_ad_category
);

router.get("/get-ad-category", ad.get_ad_category);

router.post("/run-ad", ad.run_ad);

router.get("/get-ad", ad.get_ad);

router.post("/add-packages", ad.add_package);
router.post("/select-package", ad.select_package);
router.get("/get-packages", ad.get_package);
router.get("/get-select-package", ad.getSelectedPackageByUserId);

router.post("/profile-update", profile.profile_update);

router.post(
  "/add-restaurants",
  upload.fields([{ name: "image" }]),
  food.add_restautants
);

router.get("/get-restaurants", food.get_restautants);

router.post("/add-food", upload.fields([{ name: "image" }]), food.add_food);

router.post(
  "/upload-food-images",
  multiUpload.fields([{ name: "food-images" }]),
  food.upload_food_images
);

router.get("/get-food", food.get_food);

router.get("/get-food-by-restaurants", food.get_food_by_res);

router.get("/get-food-by-id", food.get_food_by_food);

router.get("/delete-food", food.delete_food);

router.post("/add-order", food.add_order);

router.get("/get-order-by-user", food.get_order_by_user);

router.post(
  "/add-car-shop",
  upload.fields([{ name: "image" }]),
  car.add_car_shop
);

router.get("/get-car-shop", car.get_car_shop);

router.post("/add-car", upload.fields([{ name: "image" }]), car.add_car);

router.post(
  "/upload-car-images",
  multiUpload.fields([{ name: "car-images" }]),
  car.upload_car_images
);

router.get("/get-car", car.get_car);

router.get("/get-car-by-shop", car.get_car_by_shop);

router.get("/get-car-by-id", car.get_car_by_car);

router.get("/delete-car", car.delete_car);

router.post("/add-rent", car.add_rent);

router.get("/get-rent-by-user", car.get_rent_by_user);

router.post(
  "/add-delivery-company",
  upload.fields([{ name: "image" }]),
  percel_delivery.add_delivery_company
);

router.get("/get-delivery-company", percel_delivery.get_delivery_company);
router.get("/get-delivery-company-id", percel_delivery.get_delivery_company_id);

router.post("/add-order-percel", percel_delivery.add_order);

router.get("/get-order-percel", percel_delivery.get_order);

router.get("/get-percel-order-user", percel_delivery.get_order_by_user);

router.get("/delete-percel-order", percel_delivery.delete_order);

router.post("/add-conversation", message.add_conversation);

router.post("/add-message", message.add_message);

router.get("/get-conversation", message.get_conversation_member);

router.get("/get-message", message.get_messages);

router.post("/group-conversations", message.add_group_conversation);
router.post("/group-messages", message.add_group_message);
router.get("/group-conversations", message.get_group_messages);
router.get("/group-conversations-user", message.get_groups_by_user);

router.get("/group", message.get_group_conversation);

router.post(
  "/add-hajj-agency",
  upload.fields([{ name: "image" }]),
  hajj_agency.add_agency
);

router.get("/get-hajj-agencys", hajj_agency.get_agencys);

router.post(
  "/add-hajj-agency-package",
  upload.fields([{ name: "image" }]),
  hajj_agency.add_hajj_agency_package
);

router.get("/get-hajj-agency-package", hajj_agency.get_hajj_agency_package);

router.post("/book-hajj-agency-package", hajj_agency.book_agency);
router.get(
  "/get-book-hajj-agency-package",
  hajj_agency.get_booked_hajj_agency_package
);

router.post("/add-level", level.level);

router.get("/get-level", level.get_level);

router.post("/delete-level", level.delete);

router.get("/flash-sell", falshSell.flashSell);

router.get("/hot-product", falshSell.hot_product);

router.get("/product-details", falshSell.get_product_details);

router.get("/all-product", falshSell.all_product);

router.get("/product-by-cat-id", falshSell.get_product_details_by_category);

router.post("/add-book-cat", book.add_book_cat);
router.post("/add-book", upload.fields([{ name: "image" }]), book.add_book);
router.get("/get-book-cat", book.get_book_cat);
router.get("/get-book", book.get_all_book);
router.get("/get-book-by-cat", book.get_book_by_cat);
router.get("/get-book-by-id", book.get_book_by_book_id);
router.post("/add-book-order", book.add_order);
router.get("/get-book-order", book.get_order_by_user_id);

router.post(
  "/add-sport-news",
  upload.fields([{ name: "image" }]),
  sport_news.add_sport_news
);
router.get("/get-sport-news", sport_news.get_all_sport_news);

router.get("/get-sport-news-by-id", sport_news.get_sport_news_by_id);

router.post("/add-quiz", quiz.add_quiz);

router.get("/get-quiz", quiz.get_quiz);

router.post("/submit-quiz", quiz.submitQuiz);

router.post(
  "/add-org",
  upload.fields([{ name: "image" }]),
  organization.addOrganization
);

router.post(
  "/add-project",
  upload.fields([{ name: "image" }]),
  organization.addProjects
);

router.post(
  "/add-donate",
  upload.fields([{ name: "image" }]),
  organization.addDonate
);

router.post("/add-org-donation", organization.addOrgDonation);

router.get("/get-org-donation-user", organization.getOrgDonationByUserId);

router.get("/get-donate-project", organization.getDonateByProjectId);

router.get("/get-project-org", organization.getProjectsByOrgId);

router.get("/get-org", organization.getOrganizations);

router.post("/send-message", chat.sendMessage);
router.post("/start-chat", chat.startChat);
router.get("/get-chat", chat.getChatDetails);
router.get("/get-customer-chat", chat.getCustomerChats);
router.get("/get-chat-list", chat.getAdminChats);

router.post(
  "/add-streaming-hub",
  upload.fields([{ name: "image" }]),
  streaming_hub.addStreamingHub
);

router.post(
  "/add-streaming-hub-link",
  upload.fields([{ name: "image" }]),
  streaming_hub.addStreamingHubLink
);

router.get("/get-streaming-hub-link", streaming_hub.getStreamingHubLinks);

router.get("/get-streaming-hub", streaming_hub.getStreamingHubs);

router.post(
  "/add-course-cat",
  upload.fields([{ name: "image" }]),
  course_cat.addCourseCategory
);

router.post("/add-course-details", course_cat.addCourseDetails);

router.post(
  "/add-course",
  upload.fields([{ name: "image" }, { name: "video" }]),
  course_cat.addCourse
);

router.post(
  "/add-instructor",
  upload.fields([{ name: "image" }]),
  course_cat.addInstructor
);

router.post(
  "/add-course-container",
  upload.fields([{ name: "image" }]),
  course_cat.addCourseContainer
);
router.post(
  "/add-course-video",
  upload.fields([{ name: "video" }]),
  course_cat.addCourseVideo
);

router.get("/get-course-video", course_cat.getAllCourseVideo);

router.get("/get-course-cat", course_cat.getAllCourseCategories);

router.get("/get-course", course_cat.getAllCourses);

router.get("/get-course-id", course_cat.getCoursesByCatId);

router.get("/get-course-details", course_cat.getCourseDetailsById);

router.get("/get-instructor", course_cat.getInstructors);

router.get("/get-course-container", course_cat.getCourseContainers);

router.post("/add-course-order", course_cat.add_order);
router.get("/get-course-order", course_cat.getCourseOrdersByUserId);

// Exports
module.exports = router;
