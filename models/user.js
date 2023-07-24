const mongoose = require("mongoose");
const schema = mongoose.Schema;

const userschema = new schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  usertype: {
    type: String,
    required: true
  },
  phonenumber: {
    type: Number
  },
  date: {
    type: Date,
    default: Date.now
  },
});

const User = mongoose.model("User", userschema);
module.exports = User;