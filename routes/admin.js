const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken"); // To generate Token
const AdminModel = require("../models/adminModel")

router.post("/ADMIN_LOGIN", (req, res, next) => {
    AdminModel.findOne({ email: req.body.email })
      .then((user) => {
        if (!user) {
          //app crash now good..
          return res.status(401).json({
            message: "Invalid Email Address",
            status: false,
          });
        }
        bcrypt
          .compare(req.body.password, user.password)
          .then((validate) => {
            if (!validate) {
              return res.status(401).json({
                message: "Invalid Email Address or Password",
                status: false,
              });
            }
            //Valid Case generate token
            const token = jwt.sign(
              { gmail: user.email, userId: user._id },
              process.env.ADMIN_JWT_KEY,
              { expiresIn: '1h' } // 1 hour
            );
            res.status(200).json({
              message: "Login Successfully!",
              data: {
                token: token,
                expiredToken:3600,
              },
              status: true,
            });
          })
          .catch((err) => {
            return res.status(401).json({
              message: "Something Went Wrong! Please Try Again",
              status: false,
            });
          });
      })
      .catch((err) => {
        return res.status(401).json({
          message: "Something Weird! Please Try Again",
          status: false,
        });
      });
});
module.exports = router