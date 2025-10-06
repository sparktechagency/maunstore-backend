"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const unlinkFile = (file) => {
    const basePath = path_1.default.join(process.cwd(), 'uploads');
    const handleUnlink = (relativePath) => {
        const fullPath = path_1.default.join(basePath, relativePath);
        try {
            if (fs_1.default.existsSync(fullPath)) {
                const stat = fs_1.default.lstatSync(fullPath);
                if (stat.isFile()) {
                    fs_1.default.unlinkSync(fullPath);
                    console.log(`✅ File ${relativePath} deleted successfully.`);
                }
                else {
                    console.warn(`⚠️ Skipped ${relativePath}: Not a file.`);
                }
            }
            else {
                console.warn(`⚠️ File ${relativePath} not found.`);
            }
        }
        catch (err) {
            console.error(`❌ Error deleting file ${relativePath}:`, err);
        }
    };
    if (typeof file === 'string') {
        handleUnlink(file);
    }
    else if (Array.isArray(file)) {
        file.forEach(handleUnlink);
    }
    else {
        console.error('❌ Invalid input. Expected a string or an array of strings.');
    }
};
exports.default = unlinkFile;
