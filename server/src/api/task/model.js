const mongoose = require("mongoose");
const shortid = require("shortid");
const APIError = require("../../utils/APIError");
const httpStatus = require("http-status");

const taskSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            maxlength: 500,
            trim: true,
            required: true
        },
        description: {
            type: String,
            maxlength: 2000,
            trim: true
        },
        files:[{
            name: String,
            path: String
          }],
        images: [{
            name: String,
            path: String
        }],
        labels: [String],
        color: String,
        members: [
            {
                userId: {
                    type: mongoose.Types.ObjectId,
                    ref: "User"
                }
            }
        ],
        columnId: {
            type: String,
            ref: "Column",
            path: "shortid"
        },
        sortOrder: Number,
        shortid: {
            type: String,
            default: shortid.generate()
        },
        deletedAt:{
            type: Date,
        }
    },
    { timestamps: true }
);

/**
 * Statics
 */

taskSchema.statics = {
    /**
     *
     * @param {ObjectId} id - the objectId of task
     * @return {Promise<Task, APIError}
     */
    async get(id) {
        try {
            let task;
            task = await this.findOne({ shortid: id })
                // .populate("columnId", "name")
                .exec();
            if (task) {
                return task;
            }

            throw new APIError({
                message: "Task does not exists",
                status: httpStatus.NOT_FOUND
            });
        } catch (error) {
            throw error;
        }
    },

    list({ columnId }) {
        return this.find({ columnId: columnId, deletedAt: { $exists: 1}}).populate("columnId", "name");
    }
};

/**
 * Method
 */
taskSchema.method({
    transform() {
        let transformed = {};
        const fields = [
            "id",
            "title",
            "description",
            "labels",
            "color",
            "members",
            "sortOrder",
            "columnId",
            "shortid",
            "deletedAt"
        ];

        fields.forEach(field => {
            transformed[field] = this[field];
        });
        return transformed;
    }
});

module.exports = new mongoose.model("Task", taskSchema);
