const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const multerStorage = multer.diskStorage({
    destination : function(req,file,cb) {
        const pathDestination = path.join(__dirname,'../public/images');
        cb(null,pathDestination)
    },
    filename : function(req,file,cb) {
        const uniqueSuffix = Date.now() + Math.round(Math.random() * 1e9);
        cb(null,file.fieldname+"-"+uniqueSuffix+".jpeg");
    }

})

const multerFilter = async function (req,file,cb) {
    if(file.mimetype.startsWith('image')) {
        cb(null,true);
    }else {
        cb(
            {msg : "unsupported file format"},
            false
        )
    }
}

const resizeImage = async(req,res,next) => {
    console.log('resize')
    if(!req.files) {
        console.log('resize null so skip')
        next();
    }else {
        await Promise.all(
            req.files.map(async(file) => {
                await sharp(file.path).resize(300,300).toFormat('jpeg').jpeg({quality:100}).toFile(`public/images/products/${file.filename}`)
            })
        )
        next()
    }
}

const uploadImage = multer({
    storage : multerStorage,
    fileFilter : multerFilter,
    limits : {fieldSize: 5000000}
})

module.exports = {uploadImage,resizeImage}