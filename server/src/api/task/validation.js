const { Joi } = require("express-validation");

exports.createValidation = {
    body: Joi.object({
        title: Joi.string()
            .min(1)
            .max(128)
            .required(),
        description: Joi.string()
            .max(2000),
        columnId: Joi.string().required(),
        color: Joi.string()
            .min(1)
            .max(20),
        images: Joi.array().max(50),
        files: Joi.array().max(50),
        comment: Joi.array().max(2000),
        labels: [Joi.string()],
        members: [
            {
                userId: Joi.string().regex(/^[a-fA-F0-9]{24}$/)
            }
        ],
        sortOrder: Joi.number().required()
    })
};

exports.deleteValidation = {
    params: Joi.object({
        taskId: Joi.string()
    })
};

exports.updateValidation = {
    params: Joi.object({
        taskId: Joi.string()
            .required()
    }),
    body: Joi.object({
        title: Joi.string()
            .min(1)
            .max(128),
        description: Joi.string().max(2000),
        columnId: Joi.string().regex(/^[a-fA-F0-9]{24}$/),
        color: Joi.string().max(20),
        labels: [Joi.string()],
        members: [
            {
                userId: Joi.string().regex(/^[a-fA-F0-9]{24}$/)
            }
        ],
        sortOrder: Joi.number()
    })
};

exports.getValidation = {
    params: Joi.object({
        taskId: Joi.string()
            .required()
    })
};

exports.imagesList = {
    query: Joi.object({
      skip: Joi.number().min(0),
      limit: Joi.number().min(1).max(50),
      id: Joi.string()
        .regex(/^[a-fA-F0-9]{24}$/)
        .required(),
    })
};
exports.filesList = {
    query: Joi.object({
      skip: Joi.number().min(0),
      limit: Joi.number().min(1).max(50),
      id: Joi.string()
        .regex(/^[a-fA-F0-9]{24}$/)
        .required(),
    })
};
