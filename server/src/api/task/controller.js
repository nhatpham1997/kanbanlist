const Task = require("./model");
const httpStatus = require("http-status");
const APIError = require("../../utils/APIError");
const shortid = require("shortid");
const multer = require("multer");
const storagePhoto = require("../../utils/storagePhoto");
const storageFile = require("../../utils/storageFile");
const { v4 } = require("uuid");
const { request } = require("express");

exports.load = async (req, res, next, id) => {
    try {
        const task = await Task.get(id);
        req.locals = { task };
        return next();
    } catch (error) {
        return next(error);
    }
};

/**
 * Get task
 * @public
 */
exports.get = async (req, res, next) => {
    try {
        const task = req.locals.task.transform();
        return res.json({ task });
    } catch (error) {
        return next(error);
    }
};

/**
 * Create new task
 * @public
 */

exports.create = async (req, res, next) => {
    try {
        let task = await new Task({
            ...req.body,
            shortid: shortid.generate(),
        }).save();
        // task = await task
        //     .populate("columnId", "name")
        //     .execPopulate();
        res.status(httpStatus.CREATED);
        task = await task.transform();
        return res.json(task);
    } catch (error) {
        return next(error);
    }
};

/**
 * Updat task
 * @public
 */
exports.update = async (req, res, next) => {
    try {
        const task = Object.assign(req.locals.task, req.body);
        let savedTask = await task.save();
        return res.json(savedTask.transform());
    } catch (error) {
        return next(error);
    }
};

/**
 * Merge task
 * @public
 */
exports.merge = async (req, res, next) => {
    try {
        const { columnId, sortOrder } = req.body;
        const updateIndo = { columnId, sortOrder };
        const task = await Task.findOneAndUpdate(
            { shortid: req.body.taskId },
            updateIndo
        );
        return res.json(task.transform());
    } catch (error) {
        return next(error);
    }
};

/**
 * List task
 * @public
 */
exports.list = async (req, res, next) => {
    try {
        const tasks = await Task.list({ columnId: req.params.columnId });
        const transformedTasks = tasks.map((task) => task.transform());
        res.json({ tasks: transformedTasks });
    } catch (error) {
        next(error);
    }
};

/**
 * Remove task
 * @public
 */
exports.remove = async (req, res, next) => {
    try {
        const removeInfo = {
            deletedAt: new Date(),
        };
        const task = Object.assign(req.locals.task, removeInfo);
        let savedTask = await task.save();
        return res.json(savedTask.transform());
    } catch (error) {
        return next(error);
    }
};

exports.removeFile = async (req, res, next) => {
    try {
        const {type} = req.query;
        const {fileId, taskId} = req.params;
        if(type === "file"){
            await Task.findOneAndUpdate(
                {shortid: taskId}, { $pull: { files: { _id: fileId } } }, { safe: true, upsert: true }
            );
        }else{
            await Task.findOneAndUpdate(
                {shortid: taskId}, { $pull: { images: { _id: fileId } } }, { safe: true, upsert: true }
            );
        }
        return res.json({message: "success"})
    } catch (error) {
        return next(error);
    }
}

let photosUploadFile = multer(storagePhoto).single("photos");

exports.addPhotos = (req, res, next) => {
    photosUploadFile(req, res, async (err) => {
        try {
            if (!req.file) {
                console.log(err);
                throw new APIError({
                    message: err,
                    status: httpStatus.BAD_REQUEST,
                });
            }
            req.locals.task.images.push({
                name: req.file.originalname,
                path: req.file.path,
            });

            const task = await req.locals.task.save();
         
            let temp = {
                uid: task.images[task.images.length-1]._id,
                name: `${req.file.originalname}`,
                path: `${req.file.filename}`,
                status: "done",
                response: { status: "success" },
                linkProps: { download: "image" },
                thumbUrl: `${process.env.STATIC_URL}/images/tasks/${req.file.filename}`,
            };
            return res.json(temp);
        } catch (error) {
            next(error);
        }
    });
};

let filesUpload = multer(storageFile).single("files");

exports.addFiles = (req, res, next) => {
    filesUpload(req, res, async (err) => {
        try {
            if (!req.file) {
                console.log(err);
                throw new APIError({
                    message: err,
                    status: httpStatus.BAD_REQUEST,
                });
            }

            req.locals.task.files.push({
                name: req.file.originalname,
                path: req.file.filename,
            });
            await req.locals.task.save();

            let temp = {
                uid: v4(),
                name: req.file.filename,
                path: `/files/${req.file.filename}`,
                status: "done",
                response: { status: "success" },
                linkProps: { download: "file" },
            };

            return res.json(temp);
        } catch (error) {
            next(error);
        }
    });
};

exports.imageList = async (req, res, next) => {
    try {
        let imagesList = req.locals.task.images
        return res.json(imagesList);
    } catch (error) {
        next(error);
    }
};

exports.fileList = async (req, res, next) => {
    try {
        let fileList = req.locals.task.files
        return res.json(fileList);
    } catch (error) {
        next(error);
    }
};
