const multer = require("multer");
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const multerStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, "../public/images/"));
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + "-" + uniqueSuffix + ".jpeg");
    }
});

const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
        cb(null, true);
    } else {
        cb(new Error("Unsupported file format"), false);
    }
}

const uploadPhoto = multer({
    storage: multerStorage,
    fileFilter: multerFilter,
    limits: { fileSize: 20000000 }
});

const productImgResize = async (req, res, next) => {
    if (!req.files || req.files.length === 0) {
        return next();
    }
    console.log("i'm here as the resize");
    try {
        await Promise.all(
            req.files.map(async (file) => {
                await sharp(file.path)
                    .resize(300, 300)
                    .toFormat("jpeg")
                    .jpeg({ quality: 90 })
                    .toFile(`public/images/products/${file.filename}`);
            // Delete the original file
            fs.unlinkSync(`public/images/products/${file.filename}`);
        }));

        next();
    } catch (err) {
        console.log("Error in multer is ctach ", err);
        next(err);
    }
}


const blogImgResize = async (req,res,next)=>{
    if(!req.files){
        return next();
    }
    await Promise.all(req.files.map(async (file)=>{
        await sharp(file.path)
        .resize(300,300)
        .toFormat("jpeg")
        .jpeg({quality: 90})
        .toFile(`public/images/blogs/${file.filename}`);
        fs.unlinkSync(`public/images/blogs/${file.filename}`);
    }))
}

module.exports = {
    uploadPhoto,
    productImgResize,
    blogImgResize
}