import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import fs from 'fs/promises';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadImage = async (imagePath) => {
  try {
    const result = await cloudinary.uploader.upload(imagePath);

    await fs.unlink(imagePath);

    return result.secure_url;
  } catch (error) {
    console.error('Upload Error:', error);

    try {
      await fs.unlink(imagePath);
    } catch (deleteErr) {
      console.error('Failed to delete local file:', deleteErr);
    }

    return null;
  }
};

export const deleteImage = async (imageUrl) => {
  try {
    // Extract the public ID from the full Cloudinary URL
    const parts = imageUrl.split('/');
    const filename = parts[parts.length - 1];
    const publicId = filename.split('.')[0]; // Remove `.jpg` or `.png`

    const result = await cloudinary.uploader.destroy(publicId);
    console.log('Deleted image:', publicId, result);
  } catch (error) {
    console.error('Error deleting image:', error);
  }
};
