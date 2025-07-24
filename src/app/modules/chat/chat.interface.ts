import { Types } from 'mongoose';
import { CHAT_STATUS } from './chat.constant';

export type IChat = {
     participants: Types.ObjectId[];
     lastMessage: Types.ObjectId;
     read: boolean;
     deletedBy: [Types.ObjectId];
     isDeleted: boolean;
     status: CHAT_STATUS;
     readBy: Types.ObjectId[];
     // New fields for additional features
     mutedBy: Types.ObjectId[]; // Users who muted this chat
     blockedUsers: {
          // Blocking relationships within this chat
          blocker: Types.ObjectId;
          blocked: Types.ObjectId;
          blockedAt: Date;
     }[];
     pinnedMessages: Types.ObjectId[]; // Pinned message IDs
};
