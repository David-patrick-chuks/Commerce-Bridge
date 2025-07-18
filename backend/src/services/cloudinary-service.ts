import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import { CloudinaryUploadResult } from '../types';
import { project_name } from '../utils/config';

dotenv.config({ quiet: true });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadImage = async (filePath: string): Promise<CloudinaryUploadResult> => {
  return cloudinary.uploader.upload(filePath, {
    folder: `${project_name.toLowerCase()}/users`,
    resource_type: 'image',
  });
}; 