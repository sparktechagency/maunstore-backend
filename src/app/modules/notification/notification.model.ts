import { model, Schema } from 'mongoose';
import { INotification } from './notification.interface';

enum NotificationType {
     ADMIN = 'ADMIN',
     SYSTEM = 'SYSTEM',
     PAYMENT = 'PAYMENT',
     MESSAGE = 'MESSAGE',
     REFUND = 'REFUND',
     ALERT = 'ALERT',
     ORDER = 'ORDER',
     DELIVERY = 'DELIVERY',
     CANCELLED = 'CANCELLED',
}

enum NotificationScreen {
     DASHBOARD = 'DASHBOARD',
     PAYMENT_HISTORY = 'PAYMENT_HISTORY',
     PROFILE = 'PROFILE',
}

const notificationSchema = new Schema<INotification>(
     {
          title: {
               type: String,
               required: false,
          },
          message: {
               type: String,
               required: true,
          },
          receiver: {
               type: Schema.Types.ObjectId,
               ref: 'User',
               required: false,
               index: true,
          },
          reference: {
               type: Schema.Types.ObjectId,
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
     },
     {
          timestamps: true,
     },
);

notificationSchema.index({ receiver: 1, read: 1 });
// ২. TTL Index: ৩০ দিন পর অটোমেটিক ডিলিট হয়ে যাবে (30 * 24 * 60 * 60 = 2592000 seconds)
notificationSchema.index({ createdAt: 1 }, { expireAfterSeconds: 2592000 });
export const Notification = model<INotification>('Notification', notificationSchema);
