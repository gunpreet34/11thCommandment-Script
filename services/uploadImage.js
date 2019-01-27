let multer  = require('multer');
let multerS3 = require('multer-s3');
let aws = require('aws-sdk');
//For image uploading aws link
aws.config.update({
    secretAccessKey: "MPSBy1ywbtOYShBdKSIIKQN0wA5tLc+sD2GLKxIt",
    accessKeyId: "AKIAIVYJPVMM3DBB6M4Q",
    region: 'eu-west-1'
});
let s3 = new aws.S3();
//For image uploading
let uploadImage = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'commandment-news-images',
        acl: 'public-read',
        metadata: function (req, file, cb) {
            cb(null, {fieldName: file.fieldname});
        },
        key: function (req, file, cb) {
            cb(null, Date.now().toString() + file.originalname)
        }
    })
});
module.exports = uploadImage;