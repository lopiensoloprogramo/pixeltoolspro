export async function base64ToFile(

  base64: string,

  filename: string = "formal-photo.jpg"

): Promise<File> {


  const response =
    await fetch(base64);



  const blob =
    await response.blob();



  return new File(

    [blob],

    filename,

    {
      type: blob.type || "image/jpeg",
    }

  );


}