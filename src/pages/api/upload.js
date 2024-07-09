import nextConnect from 'next-connect';
import multer from 'multer';
import fs from 'fs';
import path from 'path';

// Ensure the uploads directory exists
const uploadDir = path.join(process.cwd(), 'public/zip');
const excelDir = path.join(process.cwd(), 'public/excel');
const txtDir = path.join(process.cwd(), 'public/txt');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

if (!fs.existsSync(excelDir)) {
  fs.mkdirSync(excelDir, { recursive: true });
}

if (!fs.existsSync(txtDir)) {
  fs.mkdirSync(txtDir, { recursive: true });
}

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.originalname.endsWith('.xlsx') || file.originalname.endsWith('.xls')) {
      cb(null, excelDir);
    } else if (file.originalname.endsWith('.txt')) {
      cb(null, txtDir);
    } else {
      cb(null, uploadDir);
    }
  },
  filename: (req, file, cb) => {
    cb(null, Buffer.from(file.originalname, 'latin1').toString('utf8')); // Ensure filename is saved in UTF-8
  },
});

const upload = multer({ storage });

const apiRoute = nextConnect({
  onError(error, req, res) {
    console.error('Error:', error);
    res.status(501).json({ error: `Sorry, something went wrong! ${error.message}` });
  },
  onNoMatch(req, res) {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  },
});

apiRoute.use(upload.single('file'));

apiRoute.post((req, res) => {
  res.status(200).json({ data: 'success' });
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default apiRoute;
