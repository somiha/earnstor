const getUserModel = require("../../Models/User Models/get_user_model");
const verificationModel = require("../../Models/User Models/verification_code_model");
const { queryAsync, queryAsyncWithoutValue } = require("../../Utils/helper");
const axios = require("axios");
exports.verification = async (req, res, next) => {
  try {
    let userId = req.body.user_id;
    let verificationCode = req.body.verification_code;
    const user = await getUserModel.getUserByID(userId);
    console.log(user);
    if (!user[0].length) {
      return res
        .status(400)
        .json({ status: false, msg: "No user found with this credentials" });
    }
    if (user[0][0].verification_code == verificationCode) {
      verificationModel.changeInfo(userId, 1).then((result) => {
        let data = {
          status: "Success",
          messege: "User verified",
          mobileNumber: user[0][0].mobile,
        };
        res.status(200).json(data);
      });
    } else {
      return res
        .status(400)
        .json({ status: false, msg: "invalid verification code" });
    }
  } catch (err) {
    return res.status(500).json({ status: false, msg: "something wrong" });
  }
};

exports.resend_verification = async (req, res, next) => {
  try {
    let userId = req.body.user_id;
    let mobile_number = req.body.mobile;
    let user = [];
    let updateQuery = "";
    let queryParams = [];
    const verificationCode = Math.floor(1000 + Math.random() * 9000);

    if (userId && mobile_number) {
      user = await getUserModel.getUserByMobile(userId, mobile_number);
      updateQuery = `UPDATE users SET verification_code = ? WHERE userid = ? AND mobile = ?`;
      queryParams = [verificationCode, userId, mobile_number];
    } else if (mobile_number) {
      user = await getUserModel.getUserByMobile(mobile_number);
      updateQuery = `UPDATE users SET verification_code = ? WHERE mobile = ?`;
      queryParams = [verificationCode, mobile_number];
    } else {
      user = await getUserModel.getUserByID(userId);
      updateQuery = `UPDATE users SET verification_code = ? WHERE userid = ?`;
      queryParams = [verificationCode, userId];
    }

    if (!user[0].length) {
      return res
        .status(400)
        .json({ status: false, msg: "No user found with this credentials" });
    }

    await queryAsync(updateQuery, queryParams);

    // Send OTP
    axios
      .post("http://bulksmsbd.net/api/smsapi", {
        api_key: "pUMlwMOgUGLFtqZyjIhy",
        senderid: 8809617613591,
        number: `${user[0][0].mobile}`,
        message: `Your OTP is: ${verificationCode}`,
      })
      .then((response) => {
        let data = {
          response_code: 202,
          status: "Success",
          messege: "OTP code sent",
          Verification_Code: verificationCode,
          mobileNumber: user[0][0].mobile,
          userId: user[0][0].userid,
        };
        res.status(200).json(data);
      })
      .catch((error) => {
        console.error(error);
      });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ status: false, msg: "something wrong" });
  }
};

exports.payment_verification = async (req, res, next) => {
  let userId = req.body.user_id;
  let transactionId = req.body.transaction_id;
  let mobileNumber = req.body.mobile_number;
  let amount = req.body.amount;
  let operator = req.body.operator;
  const user = await getUserModel.getUserByID(userId);
};
