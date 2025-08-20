import multer from "multer";

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if(allowedTypes.includes(file.mimetype)){
        cb(null,true);
    }
    else {
        cb(new Error('Invalid file type. Only JPEG, JPG and PNG are allowed'),false);
    }
}
export const upload = multer({storage,fileFilter});