import mongoose, { Schema } from 'mongoose';
import { IChat } from './chat.interface';
import { CHAT_STATUS } from './chat.constant';

const chatSchema = new Schema<IChat>(
     {
          participants: [{ type: Schema.Types.ObjectId, ref: 'User' }],
          lastMessage: { type: Schema.Types.ObjectId, ref: 'Message' },
          status: { type: String, enum: Object.values(CHAT_STATUS), default: CHAT_STATUS.ACTIVE },
          isDeleted: { type: Boolean, default: false },
          deletedBy: [{ type: Schema.Types.ObjectId, ref: 'User' }],
          readBy: [{ type: Schema.Types.ObjectId, ref: 'User' }],
          // New fields
          mutedBy: [{ type: Schema.Types.ObjectId, ref: 'User' }],
          blockedUsers: [
               {
                    blocker: { type: Schema.Types.ObjectId, ref: 'User', required: true },
                    blocked: { type: Schema.Types.ObjectId, ref: 'User', required: true },
                    blockedAt: { type: Date, default: Date.now },
               },
          ],
          pinnedMessages: [{ type: Schema.Types.ObjectId, ref: 'Message' }],
     },
     {
          timestamps: true,
          versionKey: false,
     },
);

export const Chat = mongoose.model<IChat>('Chat', chatSchema);
