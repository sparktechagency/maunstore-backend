import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { BookmarkServices } from './bookmark.service';

const createBookmark = catchAsync(async (req, res) => {
     const { id: userId } = req.user;
     const bookmarkData = req.body;
     const result = await BookmarkServices.createBookmarkToDB(bookmarkData, userId);
     sendResponse(res, {
          success: true,
          statusCode: 200,
          message: 'Bookmark is created successfully',
          data: result,
     });
});

const getBookmarks = catchAsync(async (req, res) => {
     const result = await BookmarkServices.getBookmarksFromDB();
     sendResponse(res, {
          success: true,
          statusCode: 200,
          message: 'Bookmarks are retrieved successfully',
          data: result,
     });
});

const deleteBookmarkById = catchAsync(async (req, res) => {
     const { bookmarkId } = req.params;
     const result = await BookmarkServices.deleteBookmarkByIdFromDB(bookmarkId);
     sendResponse(res, {
          success: true,
          statusCode: 200,
          message: 'Bookmark is deleted successfully',
          data: result,
     });
});

export const BookmarkControllers = {
     createBookmark,
     getBookmarks,
     deleteBookmarkById,
};
