export async function cleanBackgroundEdges(
  image: Blob
): Promise<Blob> {

  const bitmap =
    await createImageBitmap(image);

  const canvas =
    document.createElement("canvas");

  canvas.width = bitmap.width;
  canvas.height = bitmap.height;

  const ctx =
    canvas.getContext("2d");

  if (!ctx) {
    throw new Error(
      "No se pudo crear el canvas."
    );
  }

  ctx.drawImage(bitmap, 0, 0);

  const img =
    ctx.getImageData(
      0,
      0,
      canvas.width,
      canvas.height
    );

  const data =
    img.data;

  for (let i = 0; i < data.length; i += 4) {

    const alpha =
      data[i + 3];

    /*
    ----------------------------
    Eliminar píxeles casi
    transparentes
    ----------------------------
    */

    if (alpha < 20) {

      data[i + 3] = 0;

      continue;

    }

    /*
    ----------------------------
    Suavizar borde
    ----------------------------
    */

    if (alpha < 180) {

      data[i + 3] =
        Math.round(alpha * 0.85);

    }

    /*
    ----------------------------
    Reducir halo blanco
    ----------------------------
    */

    if (
      data[i] > 235 &&
      data[i + 1] > 235 &&
      data[i + 2] > 235 &&
      alpha < 240
    ) {

      data[i] *= 0.92;
      data[i + 1] *= 0.92;
      data[i + 2] *= 0.92;

    }

  }

  ctx.putImageData(
    img,
    0,
    0
  );

  return new Promise((resolve) => {

    canvas.toBlob((blob) => {

      if (!blob) {

        throw new Error(
          "No se pudo generar la imagen."
        );

      }

      resolve(blob);

    }, "image/png");

  });

}