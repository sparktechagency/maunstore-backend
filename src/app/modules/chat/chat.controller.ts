import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { ChatService } from './chat.service';

const createChat = catchAsync(async (req, res) => {
     const participant = req.body.participant;
     const { id: userId }: any = req.user;
     const participants = [userId, participant];
     const result = await ChatService.createChatIntoDB(participants);

     sendResponse(res, {
          statusCode: 200,
          success: true,
          message: 'Chat created successfully',
          data: result,
     });
});

const markChatAsRead = catchAsync(async (req, res) => {
     const { id } = req.params;
     const user: any = req?.user;

     const result = await ChatService.markChatAsRead(user.id, id);
     sendResponse(res, {
          statusCode: 200,
          success: true,
          message: 'Chat marked as read',
          data: result,
     });
});

const getChats = catchAsync(async (req, res) => {
     const { id: userId }: any = req.user;
     const result = await ChatService.getAllChatsFromDB(userId, req.query);

     sendResponse(res, {
          statusCode: 200,
          success: true,
          message: 'Chats retrieved successfully',
          data: {
               chats: result.data,
               // Include chat statistics in data instead of meta
               unreadChatsCount: result.unreadChatsCount,
               totalUnreadMessages: result.totalUnreadMessages,
          },
          meta: result.meta, // Standard pagination meta
     });
});

const deleteChat = catchAsync(async (req, res) => {
     const { id: userId }: any = req.user;
     const { chatId } = req.params;
     const result = await ChatService.softDeleteChatForUser(chatId, userId);
     sendResponse(res, {
          statusCode: 200,
          success: true,
          message: 'Chat deleted successfully',
          data: result,
     });
});

// New controller: Mute/Unmute chat
const muteUnmuteChat = catchAsync(async (req, res) => {
     const { id: userId }: any = req.user;
     const { chatId } = req.params;
     const { action } = req.body; // 'mute' or 'unmute'

     const result = await ChatService.muteUnmuteChat(userId, chatId, action);
     sendResponse(res, {
          statusCode: 200,
          success: true,
          message: `Chat ${action}d successfully`,
          data: result,
     });
});

// New controller: Block/Unblock user
const blockUnblockUser = catchAsync(async (req, res) => {
     const { id: userId }: any = req.user;
     const { chatId, targetUserId } = req.params;
     const { action } = req.body; // 'block' or 'unblock'

     const result = await ChatService.blockUnblockUser(userId, targetUserId, chatId, action);
     sendResponse(res, {
          statusCode: 200,
          success: true,
          message: `User ${action}ed successfully`,
          data: result,
     });
});

export const ChatController = {
     createChat,
     getChats,
     markChatAsRead,
     deleteChat,
     muteUnmuteChat,
     blockUnblockUser,
};
