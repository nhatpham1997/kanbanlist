const User = require("../user/model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {jwtSecret, jwtExpirationInterval} = require('../../config/vars')
const {omit} = require('lodash')
const moment = require('moment');
const httpStatus = require('http-status')
const PasswordResetToken = require('./passwordResetToken.model');
const emailProvider = require('../../services/email/emailProvider');
const APIError = require('../../utils/APIError');

require('dotenv').config()

const generateTokenResponse = (user, accessToken)=>{
    const expiresIn = moment().add(jwtExpirationInterval, 'minutes');
    return {
        accessToken, expiresIn
    }
}

exports.register = async (req, res, next) => {
    try {
        const userData = omit(req.body, 'role');
        const user = await new User(userData).save();
        const userTransformed = user.transform();
        const token = generateTokenResponse(userTransformed, user.token());
        res.status(httpStatus.CREATED);
        return res.json({ token, user: userTransformed });
    } catch (error) {
        next(User.checkDuplicateEmail(error));
    }
};

exports.login = async (req, res, next) => {
    try {
        const { user, accessToken } = await User.findAndGenerateToken(req.body);
        const token = generateTokenResponse(user, accessToken);
        const userTransformed = user.transform();
        return res.json({token, user: userTransformed});
    } catch (error) {
        next(error)
    }
};

exports.sendPasswordReset = async (req, res, next) => {
    try {
      const { email } = req.body;
      const user = await User.findOne({ email }).exec();
  
      if (user) {
        const passwordResetObj = await PasswordResetToken.generate(user);
        console.log(passwordResetObj);
        emailProvider.sendPasswordReset(passwordResetObj);
        res.status(httpStatus.OK);
        return res.json('success');
      }
      throw new APIError({
        status: httpStatus.BAD_REQUEST,
        message: 'No account found with that email',
      });
    } catch (error) {
      return next(error);
    }
  };

exports.resetPassword = async (req, res, next) => {
    try {
        const { email, password, resetToken } = req.body;
        const resetTokenObject = await PasswordResetToken.findOneAndRemove({
            userEmail: email,
            resetToken,
        });

        const err = {
            status: httpStatus.BAD_REQUEST,
            isPublic: true,
        };
        if (!resetTokenObject) {
            err.message = "Cannot find matching reset token";
            throw new APIError(err);
        }
        if (moment().isAfter(resetTokenObject.expires)) {
            err.message = "Reset token is expired";
            throw new APIError(err);
        }

        const user = await User.findOne({
            email: resetTokenObject.userEmail,
        }).exec();
        user.password = password;
        await user.save();
        emailProvider.sendPasswordChangeEmail(user);

        res.status(httpStatus.OK);
        return res.json("Password Updated");
    } catch (error) {
        return next(error);
    }
};
exports.updatePassword = async (req, res, next) => {
    try {
      let user = await User.get(req.user.id);
      const { oldPassword, newPassword } = req.body;
      const passwordMatch = await user.passwordMatches(oldPassword);
      if (passwordMatch) {
        user = Object.assign(user, { password: newPassword });
        return user
          .save()
          .then(() => res.json({message: "update succesfully"}))
          .catch((e) => next(e));
      }
      throw new APIError({
        message: "Passwords don't match",
        status: httpStatus.NOT_FOUND,
      });
    } catch (error) {
      next(error);
    }
};
