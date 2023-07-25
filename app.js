var express = require("express");
var mongoose = require("mongoose");
var cors = require("cors");
var bodyParser = require("body-parser");
const user = require("./routes/user");
require('dotenv').config()

var app = express();

app.use(cors());
// middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const uri = process.env.MONGODB_URI;

mongoose
  .connect(uri, {
    useNewUrlParser: true,
  })
  .then(x => {
    console.log(
      `Connected to Mongo! Database name: "${x.connections[0].name}"`
    );
  })
  .catch(err => {
    console.error("Error connecting to mongo", err);
  });

app.get("/", (req, res) => {
    res.send("working!");
});
  

app.use("/api/v1", user);

// server starting
const port = process.env.PORT || 5000;
app.listen(port, err => {
  if (err) {
    console.log(err);
  } else {
    console.log(`server is running on PORT ${port} `);
  }
});