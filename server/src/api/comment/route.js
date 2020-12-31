const express = require("express");
const controller = require("./controller");
const { authorize, LOGGED_USER } = require("../../middlewares/auth");
const { authenticate } = require("passport");

const router = express.Router();

router
    .route("/:taskid")
    .get(authorize(LOGGED_USER), controller.get)
    .put(authorize(LOGGED_USER), controller.create)

router
    .route("/delete/:id")
    .delete(authorize(LOGGED_USER), controller.delete)

module.exports = router;
