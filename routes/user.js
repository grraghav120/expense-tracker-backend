const express = require("express");

const UserModel = require("../models/userModel");
const UserFeedback = require("../models/usersFeedback");
const UserSource = require("../models/userSource");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken"); // To generate Token

const authMiddleware=require('../middleware/expenseMiddleWare');


router.post("/SIGN_UP", (req, res, next) => {
  //   console.log(req.body);
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      const User = new UserModel({
        name: req.body.name,
        username: req.body.username,
        gmail: req.body.gmail,
        password: hash, //the password should be encrypted so that no one can access the user account not even us(Admin)
        userFirstSignUp: req.body.userFirstSignUp,
        category:[...req.body.category],
      });
      User.save()
        .then((result) => {
          const token = jwt.sign(
            { gmail: req.gmail },
            process.env.JWT_KEY,
            { expiresIn: '1h' } // 1 hour
          );
          res.status(200).json({
            message: "Account Created",
            status: true,
            data: {
              UserSince: result.userFirstSignUp,
              username: result.username,
              name: result.name,
              token: token,
              expiredToken: 3600,
              userId:result._id,
            },
          });
        })
        .catch((err) => {
          console.error(err);
          res.status(500).json({
            message: 'Failed to create user',
            error: err.message,
          });
        });
    })
    .catch((err) => {
      res.status(500).json({
        error: err.message,
      });
    });
});

router.post("/LOGIN", (req, res, next) => {
  UserModel.findOne({ gmail: req.body.gmail })
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
            { gmail: user.gmail, userId: user._id },
            process.env.JWT_KEY,
            { expiresIn: '1h' } // 1 hour
          );
          res.status(200).json({
            message: "Login Successfully!",
            data: {
              token: token,
              latestLoginDate: new Date(),
              userId: user._id,
              expiredToken:3600,
              email:user.gmail,
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

router.delete("/DELETE_ACCOUNT/:id", authMiddleware,(req, res, next) => {
  UserModel.findOneAndDelete({ _id: req.params.id })
    .then((result) => {
      if (!result) {
        return res.status(404).json({
          message: "User not found",
          status: false,
        });
      }
      res.status(200).json({
        message: "Successfully deleted account",
        status: true,
      });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({
        message: "Internal Server Error",
        status: false,
      });
    });
});

router.get("/APP_VERSION", (req, res, next) => {
  res.status(200).json({
    message:'App Version successfully fetched',
    version:'v1.2.0',
    status:true,
  });
});

router.post("/USER_FEEDBACK", authMiddleware, (req, res, next) => {
  const newFeedback = new UserFeedback({
    userId:req.body.userId,
    email:req.body.email,
    rating:req.body.rating,
    reason:req.body.reason,
    createdAt:req.body.createdAt,
  });

  newFeedback.save()
  .then((result)=>{
    res.status(200).json({
      message:'FeedBack Added',
      data:{result},
      status:true,
    })
  }).catch((err)=>{
    res.status(501).json({
      message:err,
      status:false,
    });
  });
});

router.post("/CONFIRM_ACCESS",authMiddleware, (req, res, next) => {
  UserModel.findOne({ gmail: req.body.gmail })
    .then((user) => {
      bcrypt
        .compare(req.body.password, user.password)
        .then((validate) => {
          if (!validate) {
            return res.status(401).json({
              message: "Invalid Password",
              status: false,
            });
          }
          res.status(200).json({
            message: "Valid Password",
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

router.post('/USER_SOURCE',(req,res,next) => {
  const sourceBody = new UserSource({
    email:req.body.email,
    source:req.body.source,
    action:req.body.action,
    createdAt:req.body.createdAt,
  });

  sourceBody.save()
  .then((result)=>{
    res.status(200).json({
      message:'Source Added',
      data:{result},
      status:true,
    })
  }).catch((err)=>{
    res.status(501).json({
      message:err,
      status:false,
    });
  });
})

router.post('/SAVE_DATA',(req,res,next)=>{
  const allData=new SaveData({
    username:req.body.username,
    name:req.body.name,
    firstLoginDate:req.body.firstLoginDate,
    lastLoginDate:req.body.lastLoginDate,
    userId:req.body.userId,
    expenseLogged:req.body.expenseLogged,
  });
  UserModel.updateOne({_id:req.body.userId},{
    $push: { userData: allData }
  }).then((result)=>{
    res.status(200).json({
      message:'Save',
      status:true,
    })
  }).catch((err)=>{
    res.status(501).json({
      message:err,
      status:false,
    });
  });
});

module.exports = router;
