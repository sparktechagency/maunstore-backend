"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingControllers = void 0;
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const settings_service_1 = require("./settings.service");
const getPrivacyPolicy = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const htmlContent = yield settings_service_1.SettingsServices.getPrivacyPolicy();
    res.sendFile(htmlContent);
}));
const getAccountDelete = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const htmlContent = yield settings_service_1.SettingsServices.getAccountDelete();
    res.sendFile(htmlContent);
}));
const getSupport = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const htmlContent = yield settings_service_1.SettingsServices.getSupport();
    res.sendFile(htmlContent);
}));
exports.SettingControllers = {
    getPrivacyPolicy,
    getAccountDelete,
    getSupport,
};
