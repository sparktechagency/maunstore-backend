import fs from 'fs';
import path from 'path';

const unlinkFile = (file: string | string[]) => {
     const basePath = path.join(process.cwd(), 'uploads');

     const handleUnlink = (relativePath: string) => {
          const fullPath = path.join(basePath, relativePath);

          try {
               if (fs.existsSync(fullPath)) {
                    const stat = fs.lstatSync(fullPath);
                    if (stat.isFile()) {
                         fs.unlinkSync(fullPath);
                         console.log(`✅ File ${relativePath} deleted successfully.`);
                    } else {
                         console.warn(`⚠️ Skipped ${relativePath}: Not a file.`);
                    }
               } else {
                    console.warn(`⚠️ File ${relativePath} not found.`);
               }
          } catch (err) {
               console.error(`❌ Error deleting file ${relativePath}:`, err);
          }
     };

     if (typeof file === 'string') {
          handleUnlink(file);
     } else if (Array.isArray(file)) {
          file.forEach(handleUnlink);
     } else {
          console.error('❌ Invalid input. Expected a string or an array of strings.');
     }
};

export default unlinkFile;
