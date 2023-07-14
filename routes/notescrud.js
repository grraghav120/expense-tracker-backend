const express = require("express");
const CreateNote = require("../models/Notes");
const router = express.Router();

const NotesUser = require("../models/NotesUser");

router.post("/CREATE_NOTE", (req, res, next) => {
  const newNote = new CreateNote({
    content: req.body.content,
    creater: req.body.creater,
  });
  NotesUser.updateOne(
    { _id: req.body.creater },
    {
      $push: { userData: newNote },
    }
  )
    .then((result) => {
      res.status(200).json({
        message: "Note Added",
        status: true,
      });
    })
    .catch((err) => {
      res.status(501).json({
        message: err,
        status: false,
      });
    });
});

router.get("/GET_ALL_NOTES/:id",(req, res, next) => {
    NotesUser.findOne({_id:req.params.id}).then((documents) => {
      res.status(200).json({
        message: "SuccessFully Fetched",
        data: documents.userData,
        status: true,
      });
    }).catch((err)=>{
      res.status(401).json({
        message: err,
        status: false,
      });
    })
    // next();
  });


  module.exports = router;
