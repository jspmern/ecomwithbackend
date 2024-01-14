import multer from "multer";
import path from "path";
import express from 'express'
const allowedFileExtensions = ['.jpg', '.png', '.jpeg'];
const __filename = new URL(import.meta.url).pathname;
const __dirname = path.dirname(__filename);
let uploadpath=path.join(__dirname,'..','asset/uploads')
const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
   
//     console.log('**************',uploadpath)
//     cb(null,uploadpath); // Upload images will be stored in the 'uploads/images/' directory
//   },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});
const fileFilter = (req, file, cb) => {
    const extname = path.extname(file.originalname).toLowerCase();
    if (allowedFileExtensions.includes(extname)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only jpg, png, and jpeg files are allowed.'));
    }
  };
const upload = multer({ storage: storage ,fileFilter: fileFilter });
export default upload;
