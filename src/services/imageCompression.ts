import imageCompression from "browser-image-compression";


export async function compressImage(file: File) {

  const options = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
    initialQuality: 0.7,
  };


  const compressedFile = await imageCompression(
    file,
    options
  );


  return compressedFile;
}