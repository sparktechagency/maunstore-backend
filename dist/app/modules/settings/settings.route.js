"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingRoutes = void 0;
const express_1 = __importDefault(require("express"));
const settings_controller_1 = require("./settings.controller");
const router = express_1.default.Router();
router.get('/privacy-policy', settings_controller_1.SettingControllers.getPrivacyPolicy).get('/account-delete-policy', settings_controller_1.SettingControllers.getAccountDelete).get('/support', settings_controller_1.SettingControllers.getSupport);
exports.SettingRoutes = router;
