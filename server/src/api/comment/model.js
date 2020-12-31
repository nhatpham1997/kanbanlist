const mongoose = require("mongoose");
const httpStatus = require("http-status");
const APIError = require("../../utils/APIError");
const shortid = require("shortid");
const commentSchema = new mongoose.Schema(
    {
        owner: {
            type: mongoose.Types.ObjectId,
            ref: "User"
        },
        content: {
            type: String,
            maxlength: 2000,
        },
        taskid: {
            type: mongoose.Types.ObjectId,
            ref: "Task"
        },
        shortid: {
            type: String,
            default: shortid.generate()
        }
    },
    { timestamps: true }
);

commentSchema.statics = {
    /**
     * 
     * @param {ObjectId} id - the objectId of board
     * @return {Promise<Comment, APIError}
     */
    async get(id){
        try {
            let comment;
            if(mongoose.Types.ObjectId.isValid(id)){
                comment = await this.findById(id)
                    .populate("owner", "email fullName picture").exec();
            }else{
                comment = await this.findOne({ shortid: id})
                    .populate("owner", "email fullName picture")
                    .exec();
            }
            if(comment){
                return comment;
            }

            throw new APIError({
                message: 'comment does not exists',
                status: httpStatus.NOT_FOUND
            })
        } catch (error) {
            throw error
        }
    },
    list({
        currentUserId
    }){
        return this.find({ taskid: currentUserId }).populate("owner", "email fullName picture");
    }
}

commentSchema.method({
    transform(){
        let transformed = {};
        const fields = ["id", "owner", "shortid", "content", "createdAt"];

        fields.forEach(field => {
            transformed[field] = this[field];
        });
        return transformed;
    }
});

module.exports = new mongoose.model("Comment", commentSchema);
