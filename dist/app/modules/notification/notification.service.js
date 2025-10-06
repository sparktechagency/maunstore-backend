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
exports.NotificationService = void 0;
const notification_model_1 = require("./notification.model");
const AppError_1 = __importDefault(require("../../../errors/AppError"));
const http_status_codes_1 = require("http-status-codes");
const notificationsHelper_1 = require("../../../helpers/notificationsHelper");
// get notifications
const getNotificationFromDB = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield notification_model_1.Notification.find({ receiver: user.id }).populate({
        path: 'sender',
        select: 'name profile',
    });
    const unreadCount = yield notification_model_1.Notification.countDocuments({
        receiver: user.id,
        read: false,
    });
    const data = {
        result,
        unreadCount,
    };
    return data;
});
// read notifications only for user
const readNotificationToDB = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield notification_model_1.Notification.updateMany({ receiver: user.id, read: false }, { $set: { read: true } });
    return result;
});
// get notifications for admin
const adminNotificationFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield notification_model_1.Notification.find({ type: 'ADMIN' });
    return result;
});
// read notifications only for admin
const adminReadNotificationToDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield notification_model_1.Notification.updateMany({ type: 'ADMIN', read: false }, { $set: { read: true } }, { new: true });
    return result;
});
const adminSendNotificationFromDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, message, receiver } = payload;
    // Validate input
    if (!title || !message) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Title and message are required');
    }
    const notificationData = {
        title,
        referenceModel: 'MESSAGE',
        text: message,
        type: 'ADMIN',
        receiver: receiver || null,
    };
    const result = yield (0, notificationsHelper_1.sendNotifications)(notificationData);
});
exports.NotificationService = {
    adminNotificationFromDB,
    getNotificationFromDB,
    readNotificationToDB,
    adminReadNotificationToDB,
    adminSendNotificationFromDB,
};
