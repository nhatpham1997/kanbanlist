const mongoose = require('mongoose')
const {env, jwtExpirationInterval, jwtSecret} = require('../../config/vars')
const bcrypt = require('bcrypt');
const moment = require('moment');
const jwt = require("jwt-simple");
const httpStatus = require('http-status')
const APIError = require('../../utils/APIError')

const roles = ["user", "admin"];

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        maxlength: 48,
        unique: true
    },
    password: {
        type: String
    },
    fullName: {
        type: String,
        maxlength: 50
    },
    picture: String,
    role: {
        type: String, default: 'user'
    }
}, {timestamps: true})


userSchema.pre('save', async function save(next){
    try{
        if (!this.isModified("password")) {
            return next();
        }
        const rounds = env !== 'production' ? 1 : 10 
        const hash = await bcrypt.hash(this.password, rounds);
        this.password = hash;
        return next();
    }catch(error){
        next(error)
    }
})

/**
 * Method
 */
userSchema.method({
    transform() {
        let transoformed = {};
        const fields = ["id", "fullName", "email", "createdAt", "picture"];

        fields.forEach(field => {
            transoformed[field] = this[field];
        });
        return transoformed;
    },
    token() {
        const payload = {
            exp: moment()
                .add(jwtExpirationInterval, "minutes")
                .unix(),
            iat: moment().unix(),
            sub: this._id
        };
        return jwt.encode(payload, jwtSecret);
    },
    async passwordMatches(password){
        return bcrypt.compare(password, this.password)
    }
});

userSchema.statics = {
    roles,
    /**
     * 
     * @param {} options 
     */
    async findAndGenerateToken(options) {
        const { email, password } = options;

        const user = await this.findOne({ email }).exec();

        const err = {
            status: httpStatus.BAD_REQUEST,
            isPublic: true
        };
        if (!user) {
            err.message = "This account does not exists";
        } else if (password) {
            if (user && (await user.passwordMatches(password))) {
                return {
                    user,
                    accessToken: user.token()
                };
            }
            err.message = "Inconnect email or password";
        }
        throw new APIError(err);
    },

    checkDuplicateEmail(error){
        if(error.name === "MongoError" && error.code === 11000){
            return new APIError({
                message: "Email already exists",
                errors: [
                    {
                        field: "email",
                        location: "body",
                        messages: ["email already exists"]
                    }
                ],
                status: httpStatus.BAD_REQUEST,
                isPublic: true,
                stack: error.stack
            });
        }
        return error;
    }
};

/**
 * Statics
 */
userSchema.statics = {
    roles,
  
    /**
     * Get user
     *
     * @param {ObjectId} id - The objectId of user.
     * @returns {Promise<User, APIError>}
     */
    async get(id) {
      try {
        let user;
  
        if (mongoose.Types.ObjectId.isValid(id)) {
          user = await this.findById(id).exec();
        }
        if (user) {
          return user;
        }
  
        throw new APIError({
          message: "User does not exist",
          status: httpStatus.NOT_FOUND,
        });
      } catch (error) {
        throw error;
      }
    },
  
    /**
     * Find user by email and tries to generate a JWT token
     *
     * @param {ObjectId} id - The objectId of user.
     * @returns {Promise<User, APIError>}
     */
    async findAndGenerateToken(options) {
      const { email, password, refreshObject } = options;
      if (!email)
        throw new APIError({
          message: "An email is required to generate a token",
        });
  
      const user = await this.findOne({ email }).exec();
      const err = {
        status: httpStatus.BAD_REQUEST,
        isPublic: true,
      };
      if (password) {
        if (user && (await user.passwordMatches(password))) {
          return { user, accessToken: user.token() };
        }
        err.message = "Incorrect email or password";
      } else if (refreshObject && refreshObject.userEmail === email) {
        if (moment(refreshObject.expires).isBefore()) {
          err.message = "Invalid refresh token.";
        } else {
          return { user, accessToken: user.token() };
        }
      } else {
        err.message = "Incorrect email or refreshToken";
      }
      throw new APIError(err);
    },
  
    /**
     * List users in descending order of 'createdAt' timestamp.
     *
     * @param {number} skip - Number of users to be skipped.
     * @param {number} limit - Limit number of users to be returned.
     * @returns {Promise<User[]>}
     */
    async list({ page = 1, perPage = 30, term }) {
      const reg = new RegExp(term, "i");
      return this.aggregate([
        {
          $project: {
            fullname: { $concat: ["$firstname", " ", "$lastname"] },
            fullname1: { $concat: ["$lastname", " ", "$firstname"] },
            firstname: 1,
            lastname: 1,
            picture: 1,
            id: "$_id"
          },
        },
        { $match: { $or: [{ fullname: reg }, { fullname1: reg }] } },
        {
          $project: {
            fullname: 0,
            fullname1: 0,
            _id: 0
          },
        },
      ]);
    },
  
    /**
     * Return new validation error
     * if error is a mongoose duplicate key error
     *
     * @param {Error} error
     * @returns {Error|APIError}
     */
    checkDuplicateEmail(error) {
      if (error.name === "MongoError" && error.code === 11000) {
        return new APIError({
          message: "Validation Error",
          errors: [
            {
              field: "email",
              location: "body",
              messages: ['"email" already exists'],
            },
          ],
          status: httpStatus.CONFLICT,
          isPublic: true,
          stack: error.stack,
        });
      }
      return error;
    },
  
    async oAuthLogin({ service, id, email, name, picture }) {
      const user = await this.findOne({
        $or: [{ [`services.${service}`]: id }, { email }],
      });
      if (user) {
        user.services[service] = id;
        if (!user.name) user.name = name;
        if (!user.picture) user.picture = picture;
        return user.save();
      }
      const password = uuidv4();
      return this.create({
        services: { [service]: id },
        email,
        password,
        name,
        picture,
      });
    },
  };
  

module.exports = new mongoose.model("User", userSchema);
