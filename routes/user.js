const express = require("express");
const router = express.Router();
const User = require("../models/user");
const userService = require("../service/user");
const jwt = require('jsonwebtoken');
const auth = require("../middleware/auth");


//desc check
router.get("/", (req, res) => {
  res.send("user");
});


// view users
router.get("/users", auth, async (req, res) => {
    try {
      if(req.user.usertype != "admin"){
        res.status(500).json({ message: "unauthorized" });
        return;
      }
      const users = await userService.getAllUsers();
      res.json({ data: users, status: "success" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });


// view particular user
router.get("/users/:id", auth, async (req, res) => {
    try {
        if(req.user.usertype != "admin"){
            res.status(500).json({ message: "unauthorized" });
            return;
        }
        const user = await userService.getUserById(req.params.id);
        res.json({ data: user, status: "success" });
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
});
  

// add user
router.post("/users", async (req, res) => {
  let obj = {
    name: req.body.name,
    email: req.body.email,
    usertype: "employee"
  };
  try{
    let newuser;
    const user = await userService.getUserByEmail(obj.email);
    if(!user) {
        newuser = await userService.createUser(obj);
    }
    // Create token
    const payload = user ? { id: user.id, email: user.email, usertype: user.usertype, phonenumber: user.phonenumber }
     : { id: newuser.id, email: newuser.email, usertype: newuser.usertype, phonenumber: newuser.phonenumber };
    jwt.sign(
        payload,
        "jwtsecret123",
        {
            expiresIn: "1h",
        },
        (err,token) => {
            if(err){
                throw err;
            }
            res.json({
                status: "success",
                token: token
            });
        }
    );
  } catch (err) {
    res.status(500).json({ error: err.message });
  }});


// update user
router.patch("/users", auth, async (req, res) => {
  try {
    const result = await userService.updateUser(req.user.id, req.body);
    res.json({ result, status: "success" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
  });


router.get('/current', auth,
	(req,res) => {
		res.json({user: req.user});
	}
);


module.exports = router;