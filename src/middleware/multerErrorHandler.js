const multer = require('multer');

const multerErrorHandler = (error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ message: 'Dosya boyutu çok büyük.' });
        }

        return res.status(400).json({ message: 'Dosya yükleme hatası.' });
    }
    next(error);
};

module.exports = multerErrorHandler;

