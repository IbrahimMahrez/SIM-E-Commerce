import multer from 'multer';
import path from 'path';

// مسار حفظ الصور
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // تأكد أن الفولدر ده موجود
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});

export const upload = multer({ storage });
