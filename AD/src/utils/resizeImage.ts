import imageCompression from "browser-image-compression";

export const resizeImageFunction = async (
  file: File,
  maxWidth = 2000,
  maxHeight = 2000
): Promise<File> => {
  const options = {
    maxSizeMB: 2,
    maxWidthOrHeight: Math.max(maxWidth, maxHeight),
    useWebWorker: true,
  };

  try {
    if (file.size / 1024 / 1024 > 2) {
      const compressedFile = await imageCompression(file, options);
      return compressedFile;
    }
    return file;
  } catch (error) {
    console.error("Image resize failed", error);
    return file;
  }
};
