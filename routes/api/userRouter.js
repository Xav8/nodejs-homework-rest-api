const express = require("express");
const router = express.Router();
const userController = require("../../controllers/userController");
const authMiddleware = require("../../middleware/authMiddleware");

router.post("/signup", userController.signup);
router.post("/login", userController.login);
router.get("/logout", authMiddleware, userController.logout);
router.get("/current", authMiddleware, userController.current);
router.patch("/", authMiddleware, userController.updateSubscription);
router.patch("/avatars", authMiddleware, userController.updateAvatar);

module.exports = router;