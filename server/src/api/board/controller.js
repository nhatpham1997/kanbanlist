const Board = require("./model");
const Column = require('../column/model');
const Task = require("../task/model");
const httpStatus = require("http-status");
const APIError = require("../../utils/APIError");
const shortid = require('shortid');
const _ = require('lodash');
const emailProvider = require('../../services/email/emailProvider');

const checkOwner = (ownerId, currentuserId, members, currentuserEmail) => {
    if (currentuserId.toString() == ownerId.toString()) {
        return true;
    }else if(members.indexOf(currentuserEmail) != 1){
        return true;
    }
    return false;
};


exports.load = async (req, res, next, id) => {
    try {
        const board = await Board.get(id);
        req.locals = { board };
        return next();
    } catch (error) {
        return next(error);
    }
};

exports.getOldBoard = async (req, res, next) => {
    try {
        const oldBoard = await Board.findOne(
            {owner: req.user._id}
        );
        return res.json(oldBoard.transform())
        console.log(req.user);
    } catch (error) {
        return next(error);
    }
}

const getTaskByColumnId = async (columnId) => {
    return Task.find({
        columnId, deletedAt: { $exists: 0}
    }).sort("sortOrder");
}

/**
 * Get board
 * @public
 */
exports.get = async (req, res, next) => {
    try {
        const board = req.locals.board.transform();
        console.log(board.members);
        console.log(req.user);
        if (checkOwner(board.owner._id,req.user._id,board.members,req.user.email)) {
            let columns = await Column.find({ boardId: board.shortid }).sort({
                sortOrder:1,
            });
            let resColumns = await Promise.all(
                columns.map(async (column) => {
                    const columnTemp = column.transform();
                    columnTemp.tasks = await getTaskByColumnId(column.shortid);
                    return columnTemp;
                })
            );
            resColumns = _.orderBy(resColumns, ["sortOrder"], ["asc"]);
            return res.json({ board, columns: resColumns });
        }
        throw new APIError({
            message: "Something went wrong",
            status: httpStatus.BAD_REQUEST
        });
    } catch (error) {
        return next(error);
    }
};

/**
 * Create new board
 * @public
 */

exports.create = async (req, res, next) => {
    try {
        const owner = req.user._id;
        const { columns } = req.body;
        let board = await new Board({
            ...req.body,
            owner: owner,
            shortid: shortid.generate(),
        }).save();

        columns.forEach(async column => {
            await new Column({
                ...column,
                boardId: board.shortid,
                shortid: shortid.generate(),
            }).save();
        })
        board = await board
            .populate("owner", "email fullName avatar")
            .execPopulate();
        res.status(httpStatus.CREATED);
        board = await board.transform();
        return res.json(board);
    } catch (error) {
        return next(error);
    }
};

/**
 * Updat board
 * @public
 */
exports.update = async (req, res, next) => {
    try {
        // check current user is owner?
        if (checkOwner(req.locals.board.owner._id, req.user._id,req.locals.board.members,req.user.email)) {
            const board = Object.assign(req.locals.board, req.body);
            let savedBoard = await board.save();
            return res.json(savedBoard.transform());
        }
        throw new APIError({
            message: "Something went wrong",
            status: httpStatus.BAD_REQUEST
        });
    } catch (error) {
        return next(error);
    }
};

/**
 * List board
 * @public
 */
exports.list = async (req, res, next) => {
    try {
        const boards = await Board.list({ currentUserId: req.user._id });
        const transformedBoards = boards.map( board => board.transform());
        res.json({ boards:transformedBoards });
    } catch (error) {
        next(error);
    }
};

/**
 * Remove board
 * @public
 */
exports.remove = async (req, res, next) => {
    // Người dùng hiện tại có phải là chủ sở hữu của bảng này không
    try {
        const board = req.locals.board;
        console.log(board.members);
        if (checkOwner(board.owner._id,req.user._id,board.members,req.user.email)){
            let boardRemoved = await board.remove()
            return res.json(boardRemoved.transform());
        }
        throw new APIError({
            message: "Something went wrong",
            status: httpStatus.BAD_REQUEST
        });
                
    } catch (error) {

        return next(error);
    }
};

exports.sendAddMembers = async (req, res, next) => {
    try {
        emailProvider.sendAddMembers(req.query, req.locals.board.shortid, req.user.email);
        const members = req.locals.board.members;
        if(members.indexOf(req.query.email) === -1){
            req.locals.board.members.push(req.query.email);
            const board = await req.locals.board.save();
            res.status(httpStatus.OK);
            return res.json(req.query.email);
        }
        return res.json("Member duplicate");
    } catch (error) {
        return next(error);
    }
}
