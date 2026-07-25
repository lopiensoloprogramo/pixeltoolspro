import { pipeline, RawImage } from "@huggingface/transformers";

let remover: any = null;

export async function removeBackground(
  imageFile: File
): Promise<RawImage> {
  // Cargar el modelo una sola vez
  if (!remover) {
    console.log("Cargando modelo...");

    remover = await pipeline(
      "background-removal",
      "Xenova/modnet"
    );

    console.log("Modelo cargado correctamente");
  }

  // Convertir el File a RawImage
  const image = await RawImage.fromBlob(imageFile);

  console.log("Procesando imagen...");

  // Ejecutar el modelo
  const output = await remover(image);

  console.log("Imagen procesada");

  return Array.isArray(output)
    ? output[0]
    : output;
}