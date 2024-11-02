import dotenv from 'dotenv';  // Để sử dụng biến môi trường từ file .env // Để tạo server HTTP
import cloudinary from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer'; 
// Thiết lập dotenv
dotenv.config(); 

// Cấu hình Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Thiết lập lưu trữ Multer sử dụng Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary.v2,
  params: {
    folder: 'newspaper_images',  // Tên thư mục trên Cloudinary
    allowed_formats: ['jpg', 'png', 'jpeg'],  // Các định dạng ảnh cho phép
  }
});

const upload = multer({ storage });

export default upload;