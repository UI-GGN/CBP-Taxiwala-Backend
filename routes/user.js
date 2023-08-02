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
  

// view particular user
router.get("/users/:emailid/employeeId", async (req, res) => {
    try {
        const user = await userService.getUserByEmail(req.params.emailid);        
        if(user && user.employeeId){
            return res.json({ data: { employeeId: user.employeeId }, status: "success" });
        }
        res.json({ data: { employeeId: null }, status: "success" });
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
});


// add user
router.post("/users", async (req, res) => {
  let obj = {
    name: req.body.name,
    email: req.body.email,
    employeeId: req.body.employeeId,
    usertype: "employee"
  };
  try{
    let newuser;
    const user = await userService.getUserByEmail(obj.email);
    if(!user) {
        newuser = await userService.createUser(obj);
    }
    // Create token
    const payload = user ? { id: user.id, employeeId: user.employeeId, email: user.email, name: user.name, usertype: user.usertype, phonenumber: user.phonenumber }
     : { id: newuser.id, employeeId: newuser.employeeId, email: newuser.email, name: newuser.name, usertype: newuser.usertype, phonenumber: newuser.phonenumber };
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