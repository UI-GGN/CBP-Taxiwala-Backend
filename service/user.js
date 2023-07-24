const User = require("../models/user");
 
exports.getAllUsers = async () => {
  return await User.find({usertype: "employee"});
};
 
exports.createUser = async (user) => {
  return await User.create(user);
};

exports.getUserById = async (id) => {
  return await User.findById(id);
};

exports.getUserByEmail = async (email) => {
    return await User.findOne({email: email});
};
 
exports.updateUser = async (id, data) => {
  return await User.findByIdAndUpdate(id, data, { new: true });
};
 
exports.deleteUser = async (id) => {
  return await User.findByIdAndDelete(id);
};