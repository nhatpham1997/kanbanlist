const express = require('express')
const controller = require('./controller')
const router = express.Router();

router.route("/register").post(controller.register);
router.route("/login").post(controller.login);
router.route("/send-password-reset").post(controller.sendPasswordReset);
router.route("/reset-password").post(controller.resetPassword);

module.exports = router;
