const Comment = require("./model");
const httpStatus = require("http-status");
const APIError = require("../../utils/APIError");
const shortid = require('shortid');
const { mongo } = require("../../config/vars");

exports.get = async (req, res, next) => {
    try {
        const comments = await Comment.list({ currentUserId: req.params.taskid });
        const transformedcomments = comments.map( board => board.transform());
        res.json({ comments: transformedcomments });
    } catch (error) {
        return next(error);
    }
}

exports.create = async (req, res, next) => {
    try {
        const owner = req.user._id;
        let comment = await new Comment({
            ...req.body,
            owner: owner,
            taskid: req.params.taskid,
            shortid: shortid.generate(),
        }).save();
        comment = await comment
            .populate("owner", "email fullName avatar")
            .execPopulate();
        res.status(httpStatus.CREATED);
        comment = await comment.transform();
    } catch (error) {
        return next(error);
    }
}

exports.delete = async (req, res, next) => {
    try {
        let id = req.params.id;
        let savedComment = await Comment.findByIdAndDelete(id);
        res.json(savedComment);
    } catch (error) {
        return next(error);
    }
}
