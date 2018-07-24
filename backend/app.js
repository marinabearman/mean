const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const config = require('./config/database');
const postsRoutes = require("./routes/posts");
const userRoutes = require("./routes/user");


const app = express();

// Connect mongoose to our database
mongoose.connect(config.database)
.then(
  () => {
    console.log('Database connected!');
  }
)
.catch(
  () => {
    console.log('Connection failed!')
  }
);


app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
//make image path accessible to front end

app.use("/images", express.static(path.join("backend/images")));

// CORS 
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});

app.use("/api/posts", postsRoutes);
app.use("/api/user", userRoutes);

module.exports = app;
