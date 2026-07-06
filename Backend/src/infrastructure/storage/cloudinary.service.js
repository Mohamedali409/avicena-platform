import { v2 as cloudinary } from "cloudinary";

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
