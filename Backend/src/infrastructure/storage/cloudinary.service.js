import { v2 as cloudinary } from "cloudinary";

/**
 * Upload a file buffer or local path to cloudinary.
 * @param {string} filePath - local disk path from multer
 * @param {string} folder   - cloudinary folder name
 */
export const uploadImage = async (filePath, folder = "avicena") => {
  const result = await cloudinary.uploader.upload(filePath, {
    resource_type: "image",
    folder,
  });
  return result.secure_url;
};

export const deleteImage = async (publicId) => {
  await cloudinary.uploader.destroy(publicId);
};
