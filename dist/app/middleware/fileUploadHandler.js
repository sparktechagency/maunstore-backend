"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const http_status_codes_1 = require("http-status-codes");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const fileUploadHandler = () => {
    // Create upload folder
    const baseUploadDir = path_1.default.join(process.cwd(), 'uploads');
    if (!fs_1.default.existsSync(baseUploadDir)) {
        fs_1.default.mkdirSync(baseUploadDir);
    }
    // Folder create for different file types
    const createDir = (dirPath) => {
        if (!fs_1.default.existsSync(dirPath)) {
            fs_1.default.mkdirSync(dirPath);
        }
    };
    // Create filename
    const storage = multer_1.default.diskStorage({
        destination: (req, file, cb) => {
            let uploadDir;
            switch (file.fieldname) {
                case 'image':
                    uploadDir = path_1.default.join(baseUploadDir, 'image');
                    break;
                case 'profileImage':
                    uploadDir = path_1.default.join(baseUploadDir, 'profileImage');
                    break;
                case 'images':
                    uploadDir = path_1.default.join(baseUploadDir, 'images');
                    break;
                case 'thumbnail':
                    uploadDir = path_1.default.join(baseUploadDir, 'thumbnail');
                    break;
                case 'banner':
                    uploadDir = path_1.default.join(baseUploadDir, 'banner');
                    break;
                case 'permits':
                    uploadDir = path_1.default.join(baseUploadDir, 'permits');
                    break;
                case 'insurance':
                    uploadDir = path_1.default.join(baseUploadDir, 'insurance');
                    break;
                case 'driverLicense':
                    uploadDir = path_1.default.join(baseUploadDir, 'driverLicense');
                    break;
                case 'logo':
                    uploadDir = path_1.default.join(baseUploadDir, 'logo');
                    break;
                case 'audio':
                    uploadDir = path_1.default.join(baseUploadDir, 'audio');
                    break;
                case 'video':
                    uploadDir = path_1.default.join(baseUploadDir, 'video');
                    break;
                case 'document':
                    uploadDir = path_1.default.join(baseUploadDir, 'document');
                    break;
                default:
                    uploadDir = path_1.default.join(baseUploadDir, 'others');
            }
            createDir(uploadDir);
            cb(null, uploadDir);
        },
        filename: (req, file, cb) => {
            const fileExt = path_1.default.extname(file.originalname);
            const fileName = file.originalname.replace(fileExt, '').toLowerCase().split(' ').join('-') + '-' + Date.now();
            cb(null, fileName + fileExt);
        },
    });
    // File filter
    const filterFilter = (req, file, cb) => {
        if (file.fieldname === 'image' ||
            file.fieldname === 'images' ||
            file.fieldname === 'profileImage' ||
            file.fieldname === 'thumbnail' || // Added the 'thumbnail' field here
            file.fieldname === 'logo' ||
            file.fieldname === 'banner' ||
            file.fieldname === 'permits' ||
            file.fieldname === 'insurance' ||
            file.fieldname === 'driverLicense') {
            if (file.fieldname === 'images/png' ||
                file.mimetype === 'images/jpg' ||
                file.mimetype === 'images/jpeg' ||
                file.mimetype === 'images/svg' ||
                file.mimetype === 'images/webp' ||
                file.mimetype === 'image/png' ||
                file.mimetype === 'image/jpg' ||
                file.mimetype === 'image/jpeg' ||
                file.mimetype === 'image/svg' ||
                file.mimetype === 'image/webp' ||
                file.mimetype === 'application/octet-stream' ||
                file.mimetype === 'image/svg+xml') {
                cb(null, true);
            }
            else {
                cb(new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Only .jpeg, .png, .jpg .svg .webp .octet-stream .svg+xml file supported'));
            }
        }
        else if (file.fieldname === 'audio') {
            if (file.mimetype === 'audio/mpeg' || file.mimetype === 'audio/mp3' || file.mimetype === 'audio/wav' || file.mimetype === 'audio/ogg' || file.mimetype === 'audio/webm') {
                cb(null, true);
            }
            else {
                cb(new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Only .mp3, .wav, .ogg, .webm audio files are supported'));
            }
        }
        else if (file.fieldname === 'video') {
            if (file.mimetype === 'video/mp4' ||
                file.mimetype === 'video/webm' ||
                file.mimetype === 'video/quicktime' ||
                file.mimetype === 'video/x-msvideo' ||
                file.mimetype === 'video/x-matroska' ||
                file.mimetype === 'video/mpeg') {
                cb(null, true);
            }
            else {
                cb(new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Only .mp4, .webm, .mov, .avi, .mkv, .mpeg video files are supported'));
            }
        }
        else if (file.fieldname === 'document') {
            if (file.mimetype === 'application/pdf' ||
                file.mimetype === 'application/msword' ||
                file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
                file.mimetype === 'application/vnd.ms-excel' ||
                file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
                file.mimetype === 'application/vnd.ms-powerpoint' ||
                file.mimetype === 'application/vnd.openxmlformats-officedocument.presentationml.presentation' ||
                file.mimetype === 'text/plain' ||
                file.mimetype === 'application/rtf' ||
                file.mimetype === 'application/zip' ||
                file.mimetype === 'application/x-7z-compressed' ||
                file.mimetype === 'application/x-rar-compressed') {
                cb(null, true);
            }
            else {
                cb(new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Only PDF, Word, Excel, PowerPoint, text, RTF, zip, 7z, and rar files are supported'));
            }
        }
        else {
            // Allow PDF files for all other field types
            if (file.mimetype === 'application/pdf') {
                cb(null, true);
            }
            else {
                cb(new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'This file type is not supported'));
            }
        }
    };
    const upload = (0, multer_1.default)({
        storage: storage,
        limits: {
            fileSize: 100 * 1024 * 1024, // 100MB file size limit
        },
        fileFilter: filterFilter,
    }).fields([
        { name: 'image', maxCount: 10 },
        { name: 'profileImage', maxCount: 1 },
        { name: 'images', maxCount: 10 },
        { name: 'thumbnail', maxCount: 5 }, // Added this line for thumbnail
        { name: 'logo', maxCount: 5 },
        { name: 'banner', maxCount: 5 },
        { name: 'audio', maxCount: 5 },
        { name: 'video', maxCount: 5 },
        { name: 'document', maxCount: 10 },
        { name: 'driverLicense', maxCount: 1 },
        { name: 'insurance', maxCount: 1 },
        { name: 'permits', maxCount: 1 },
    ]);
    return upload;
};
exports.default = fileUploadHandler;
