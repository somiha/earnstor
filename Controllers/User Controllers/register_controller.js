const registerModel = require("../../Models/User Models/register_model");
const axios = require("axios");
exports.Register = async (req, res, next) => {
  let name = req.body.name;
  let email = req.body.email;
  let mobile = req.body.mobile;
  let password = req.body.password;
  let referCode = req.body.refer;
  let country = req.body.country;

  console.log("body", req.body);

  // generate 8 digit refer code also check if any user exist with that user if exist create and check unit not found unique

  const myReferCode = Math.floor(10000000 + Math.random() * 90000000);

  while (true) {
    const checkUser = await registerModel.isUserExistWithReferCode(myReferCode);
    if (checkUser[0].length < 1) {
      break;
    } else {
      myReferCode = Math.floor(10000000 + Math.random() * 90000000);
    }
  }

  //four digit random number
  const verificationCode = Math.floor(1000 + Math.random() * 9000);
  registerModel.checkUser(mobile).then((result1) => {
    if (result1[0].length < 1) {
      if (referCode) {
        registerModel
          .userRegisterWithRefer(
            name,
            email,
            mobile,
            password,
            referCode,
            myReferCode,
            verificationCode,
            0,
            0,
            0,
            0,
            0,
            country
          )
          .then((result2) => {
            // registerModel
            //   .increaseRefer(referCode)
            //   .then((result3) => {
            // let data = {
            //   status: "Success",
            //   messege: "User registered",
            //   userID: result2[0].insertId,
            // };
            // res.status(200).json(data);
            // Generate OTP

            // Send OTP
            axios
              .post("http://bulksmsbd.net/api/smsapi", {
                api_key: "pUMlwMOgUGLFtqZyjIhy",
                senderid: 8809617613591,
                number: `${mobile}`,
                message: `Your OTP is: ${verificationCode}`,
              })
              .then((response) => {
                res.status(200).json({
                  response_code: 202,
                  status: "Success",
                  userID: result2[0].insertId,
                  message: "OTP sent successfully",
                });
              })
              // .catch((error) => {
              //   console.error(error);
              // });
              // })
              .catch((error) => {
                console.log(error);
              });
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        registerModel
          .userRegisterWithoutRefer(
            name,
            email,
            mobile,
            password,
            verificationCode,
            myReferCode,
            0,
            0,
            0,
            0,
            0,
            country
          )
          .then((result) => {
            // let data = {
            //   status: "Success",
            //   messege: "User registered",
            //   userID: result[0].insertId,
            // };
            // res.status(200).json(data);

            // Generate OTP

            // Send OTP
            axios
              .post("http://bulksmsbd.net/api/smsapi", {
                api_key: "pUMlwMOgUGLFtqZyjIhy",
                senderid: 8809617613591,
                number: `${mobile}`,
                message: `Your OTP is: ${verificationCode}`,
              })
              .then((response) => {
                res.status(200).json({
                  response_code: 202,
                  status: "Success",
                  userID: result[0].insertId,
                  message: "OTP sent successfully",
                });
              })
              .catch((error) => {
                console.error(error);
              });
          })
          .catch((error) => {
            console.log(error);
          });
      }
    } else {
      let data = {
        status: "Failed",
        messege: "User already registered",
        userID: null,
      };
      res.status(400).json(data);
    }
  });
};
