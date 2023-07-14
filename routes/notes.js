const express = require("express");

const NotesUserModel = require("../models/NotesUser");
const router = express.Router();

router.post("/SIGN_UP", (req, res, next) => {
  const User = new NotesUserModel({
    username: req.body.username,
    gmail: req.body.gmail,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
  });
  User.save()
    .then((result) => {
      res.status(200).json({
        message: "Account Created",
        status: true,
        data: {
          username: result.username,
          gmail: result.username,
          userId: result._id,
        },
      });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({
        message: "Failed to create user",
        error: err.message,
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err.message,
      });
    });
});

router.post("/LOGIN", (req, res, next) => {
  NotesUserModel.findOne({ gmail: req.body.gmail })
    .then((user) => {
      if (!user) {
        return res.status(401).json({
          message: "Invalid Email Address",
          status: false,
        });
      }
      if (req.body.password !== user.password) {
        return res.status(401).json({
          message: "Invalid Email Address or Password",
          status: false,
        });
      }
      res
        .status(200)
        .json({
          message: "Login Successfully!",
          data: {userId: user._id},
          status: true,
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

module.exports = router;
