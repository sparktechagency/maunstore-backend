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
exports.SettingsServices = void 0;
const path_1 = __importDefault(require("path"));
const getPrivacyPolicy = () => __awaiter(void 0, void 0, void 0, function* () {
    return path_1.default.join(__dirname, '..', 'htmlResponse', 'privacyPolicy.html');
});
const getAccountDelete = () => __awaiter(void 0, void 0, void 0, function* () {
    return path_1.default.join(__dirname, '..', 'htmlResponse', 'accountDelete.html');
});
const getSupport = () => __awaiter(void 0, void 0, void 0, function* () {
    return path_1.default.join(__dirname, '..', 'htmlResponse', 'support.html');
});
exports.SettingsServices = {
    getPrivacyPolicy,
    getAccountDelete,
    getSupport,
};
