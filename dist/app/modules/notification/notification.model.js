"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Notification = void 0;
const mongoose_1 = require("mongoose");
var NotificationType;
(function (NotificationType) {
    NotificationType["ADMIN"] = "ADMIN";
    NotificationType["SYSTEM"] = "SYSTEM";
    NotificationType["PAYMENT"] = "PAYMENT";
    NotificationType["MESSAGE"] = "MESSAGE";
    NotificationType["REFUND"] = "REFUND";
    NotificationType["ALERT"] = "ALERT";
    NotificationType["ORDER"] = "ORDER";
    NotificationType["DELIVERY"] = "DELIVERY";
    NotificationType["CANCELLED"] = "CANCELLED";
})(NotificationType || (NotificationType = {}));
var NotificationScreen;
(function (NotificationScreen) {
    NotificationScreen["DASHBOARD"] = "DASHBOARD";
    NotificationScreen["PAYMENT_HISTORY"] = "PAYMENT_HISTORY";
    NotificationScreen["PROFILE"] = "PROFILE";
})(NotificationScreen || (NotificationScreen = {}));
const notificationSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: false,
    },
    message: {
        type: String,
        required: true,
    },
    receiver: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: false,
        index: true,
    },
    reference: {
        type: mongoose_1.Schema.Types.ObjectId,
        refPath: 'referenceModel',
        required: false,
    },
    referenceModel: {
        type: String,
        enum: ['PAYMENT', 'ORDER', 'MESSAGE', 'REFUND', 'ALERT', 'DELIVERY', 'CANCELLED'],
        required: false,
    },
    screen: {
        type: String,
        enum: Object.values(NotificationScreen),
        required: false,
    },
    read: {
        type: Boolean,
        default: false,
        index: true,
    },
    type: {
        type: String,
        enum: Object.values(NotificationType),
        required: false,
    },
}, {
    timestamps: true,
});
notificationSchema.index({ receiver: 1, read: 1 });
exports.Notification = (0, mongoose_1.model)('Notification', notificationSchema);
