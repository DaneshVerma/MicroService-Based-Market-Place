const ImageKit = require("imagekit");
const config = require("../config/config");
const { v4: uuidv4 } = require("uuid");

const imagekit = new ImageKit({
  publicKey: config.IMAGEKIT_PUBLIC_KEY,
  privateKey: config.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: config.IMAGEKIT_URL_ENDPOINT,
});

async function uploadImages({ buffer, filename, folder = "/products" }) {
  try {
    const response = await imagekit.upload({
      file: buffer,
      fileName: `${uuidv4()}-${filename}`,
      folder,
    });
    return {
      url: response.url,
      thumbnailUrl: response.thumbnailUrl,
      fileId: response.fileId,
    };
  } catch (error) {
    console.error("Error uploading image to ImageKit:", error);
    throw new Error("Image upload failed");
  }
}

async function deleteImage(fileId) {
  try {
    const response = await imagekit.deleteFile(fileId);
    return response;
  } catch (error) {
    console.error("Error deleting image from ImageKit:", error);
  }
}
module.exports = {
  uploadImages,
  deleteImage,
};
