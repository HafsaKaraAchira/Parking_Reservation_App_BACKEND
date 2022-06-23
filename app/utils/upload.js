const pathlib = require("path");
const fs = require("fs");

const upload = (file) => {
    if (file){
        let uploadedFilePath;
        let {originalname, path} = file;
        uploadedFilePath = path + pathlib.extname(originalname);
        fs.rename(path, uploadedFilePath, (err) => {
            if ( err ){
                return {
                    error: err
                }
            }
        })
        return pathlib.basename(uploadedFilePath);
    }
}
const deleteFiles = (files) => {
    for (let i = 0; i < files.length; i++) {
        fs.unlink(files[i], (err) => {
            if ( err ){
                return {
                    error: err
                }
            }
        })
    }
}

module.exports = upload