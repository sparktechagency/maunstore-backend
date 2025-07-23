import { Request, Response, NextFunction } from 'express';
import { getSingleFilePath, IFolderName } from '../../shared/getFilePath';

const parseFileData = (fieldName: IFolderName) => {
     return async (req: Request, res: Response, next: NextFunction) => {
          try {
               const filePath = getSingleFilePath(req.files, fieldName);

               let parsedData = {};
               if (req.body && req.body.data) {
                    parsedData = JSON.parse(req.body.data);
               }

               // ✅ merge everything properly
               req.body = {
                    ...parsedData,
                    ...req.body, // overwrite with raw form fields if duplicate
                    [fieldName]: filePath,
               };

               next();
          } catch (error) {
               next(error);
          }
     };
};

export default parseFileData;
