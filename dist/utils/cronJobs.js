"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const figlet_1 = __importDefault(require("figlet"));
const chalk_1 = __importDefault(require("chalk"));
// ASCII Art Title
(0, figlet_1.default)('Moshfiqur Rahman', (err, data) => {
    if (err) {
        console.log('Something went wrong...');
        console.dir(err);
        return;
    }
    // Print the title with color
    console.log(chalk_1.default.red.redBright(data));
    // Print version info and system details with color
    console.log(chalk_1.default.cyan('VERSION INFO:'));
    console.log(chalk_1.default.magenta('Node.js: v22.17.0'));
    console.log(chalk_1.default.blue('OS: Windows'));
});
const setupTimeManagement = () => {
    console.log('🚀 Setting up trial management cron jobs...');
};
exports.default = setupTimeManagement;
