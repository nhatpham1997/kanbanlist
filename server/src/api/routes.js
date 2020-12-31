const express = require('express');

const authRoutes = require('./auth/route');
const boardRoutes = require('./board/route')
const columnRoutes = require("./column/route");
const taskRoutes = require("./task/route");
const userRoutes = require("./user/route");
const commentRoutes = require("./comment/route");

const router = express.Router();

/**
 * GET v1/status
 */
router.get('/status', (req, res)=> res.send('OK'))

/**
 * GET v1 docs
 */
router.use('/docs', express.static('docs'));

router.use('/auth', authRoutes);
router.use("/board", boardRoutes);
router.use("/column", columnRoutes);
router.use("/task", taskRoutes);
router.use("/user", userRoutes);
router.use("/comment", commentRoutes);

module.exports = router;
