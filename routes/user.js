const express = require("express");
const router = express.Router();
const userController = require("../controllers/user");
const auth = require("../auth");

// User Registration
router.post("/register", userController.registerUser);

// User Authentication
router.post("/login", userController.loginUser);

// Retrieve User Details (Authenticated User)
router.get("/details", auth.verify, userController.getUserDetails);

// Update User as Admin (Admin-only)
router.patch("/:id/set-as-admin", auth.verify, userController.setUserAsAdmin);

// Update Password (Authenticated User)
router.patch("/update-password", auth.verify, userController.updatePassword);

module.exports = router;