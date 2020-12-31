const multer = require("multer");
const { v4 } = require("uuid");
const path = require("path");
const { avatarTypes, avatarDirectory, avatarLimitSize } = require("../config/vars");
module.exports = {
  storage: new multer.diskStorage({
    destination: (req, file, callback) => {
      callback(null, avatarDirectory);
    },
    filename: (req, file, callback) => {
      let math = avatarTypes;
      if (math.indexOf(file.mimetype) === -1) {
        return callback("Only .png, .jpg and .jpeg format allowed!", null);
      }
      let avatarName = `${Date.now()}-${v4()}-${file.originalname}`;
      console.log(avatarName);
      callback(null, avatarName);
    },
  }),
  limits: { fileSize: avatarLimitSize },
};
