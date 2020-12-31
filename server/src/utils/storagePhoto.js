const multer = require('multer')
const { v4 } = require("uuid");
const path = require("path");
const {photoDirectory, photoTypes, photoLimitSize} = require('../config/vars');
module.exports = {
  storage: new multer.diskStorage({
    destination: (req, file, callback) => {
      callback(null, photoDirectory);
    },
    filename: (req, file, callback) => {
      let math = photoTypes;
      if (math.indexOf(file.mimetype) === -1) {
        return callback("Only .png, .jpg and .jpeg format allowed!", null);
      }
      let imageName = `${Date.now()}-${v4()}-${file.originalname}`;
      //   .${file.originalname.split(".").pop()}
      callback(null, imageName);
    },
  }),
  limits: { fileSize: photoLimitSize },
};
