const express = require("express");

const app = express(); //express app, act as a middleware

const bodyParser = require("body-parser"); //imnport body-parser

const userRoutes=require('./routes/user');
const expenseRoutes=require('./routes/expense');
const adminRoutes = require('./routes/admin');
const mongoose = require("mongoose");
mongoose.connect('mongodb+srv://'+process.env.MONGO_ATLAS_USERNAME+':'+process.env.MONGO_ATLAS_PW+'@cluster0.ywmh36y.mongodb.net/'+process.env.MONGO_ATLAS_DATABASE_NAME)
.then(()=>{
  console.log("Connected to database");
})
.catch(()=>{
  console.log("Not able to connect to database");
})


app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin,X-Requested-With,Content-Type,Accept,authentication",
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,POST,DELETE,PATCH,OPTIONS"
  );
  next();
});

app.use('/v1/api',expenseRoutes);
app.use('/v1/api/USER',userRoutes);
app.use('/v2/api/ADMIN',adminRoutes);
module.exports = app;
