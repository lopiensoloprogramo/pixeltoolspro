
import {
  AutoModel,
  AutoProcessor,
  RawImage,
} from "@huggingface/transformers";

const MODEL_ID = "studioludens/birefnet-lite-512";

let model: any = null;
let processor: any = null;
let loading: Promise<void> | null = null;

async function loadModel(): Promise<void> {
  if (model && processor) return;

  if (!loading) {
    loading = (async () => {
      console.log(`Cargando ${MODEL_ID} en wasm con fp32...`);

      const loadedModel = await AutoModel.from_pretrained(MODEL_ID, {
        device: "wasm",
        dtype: "fp32",
      });

      const loadedProcessor =
        await AutoProcessor.from_pretrained(MODEL_ID);

      model = loadedModel;
      processor = loadedProcessor;

      console.log("BiRefNet Lite 512 cargado correctamente.");
    })();
  }

  try {
    await loading;
  } catch (error) {
    model = null;
    processor = null;
    throw error;
  } finally {
    loading = null;
  }
}

async function createTransparentPng(
  file: File,
  alpha: Uint8ClampedArray,
  maskWidth: number,
  maskHeight: number
): Promise<Blob> {
  const source = await createImageBitmap(file);

  try {
    const width = source.width;
    const height = source.height;

    if (
      !maskWidth ||
      !maskHeight ||
      alpha.length !== maskWidth * maskHeight
    ) {
      throw new Error("La máscara generada no es válida.");
    }

    // Crear la máscara con transparencia alfa.
    const maskCanvas = document.createElement("canvas");
    maskCanvas.width = maskWidth;
    maskCanvas.height = maskHeight;

    const maskContext = maskCanvas.getContext("2d");

    if (!maskContext) {
      throw new Error("No se pudo crear la máscara.");
    }

    const maskImage = maskContext.createImageData(
      maskWidth,
      maskHeight
    );

    for (let i = 0; i < alpha.length; i++) {
      const offset = i * 4;

      maskImage.data[offset] = 255;
      maskImage.data[offset + 1] = 255;
      maskImage.data[offset + 2] = 255;
      maskImage.data[offset + 3] = alpha[i];
    }
let min = 255;
let max = 0;
let sum = 0;
let opaquePixels = 0;

for (const value of alpha) {
  min = Math.min(min, value);
  max = Math.max(max, value);
  sum += value;

  if (value > 127) {
    opaquePixels++;
  }
}

    console.log("Máscara:", {
      dimensiones: `${maskWidth}x${maskHeight}`,
      minimo: min,
      maximo: max,
      promedio: Math.round(sum / alpha.length),
      porcentajeOpaco: Math.round(
        (opaquePixels / alpha.length) * 100
      ),
    });
    maskContext.putImageData(maskImage, 0, 0);

    // Mantener la resolución original de la fotografía.
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext("2d");

    if (!context) {
      throw new Error("No se pudo crear la imagen final.");
    }

    context.drawImage(source, 0, 0);

    // Aplicar la máscara ampliándola suavemente.
    context.globalCompositeOperation = "destination-in";
    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = "high";
    context.drawImage(maskCanvas, 0, 0, width, height);
    context.globalCompositeOperation = "source-over";

    return await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error("No se pudo generar el PNG."));
          }
        },
        "image/png"
      );
    });
  } finally {
    source.close();
  }
}

export async function removeBackground(
  imageFile: File
): Promise<Blob> {
  await loadModel();

  const image = await RawImage.fromBlob(imageFile);
  const { pixel_values } = await processor(image);

  console.log("Procesando imagen con BiRefNet Lite 512...");

const output = await model({
  input_image: pixel_values,
});

const mask = output?.output_image;

if (!mask?.dims || !mask?.data) {
  console.error("Salida del modelo:", output);
  throw new Error("BiRefNet no devolvió una máscara válida.");
}

const dims = mask.dims as number[];
const values = mask.data as ArrayLike<number>;

const maskHeight = dims[dims.length - 2];
const maskWidth = dims[dims.length - 1];

console.log("Dimensiones de la máscara:", dims);

if (
  !maskWidth ||
  !maskHeight ||
  values.length !== maskWidth * maskHeight
) {
  throw new Error(
    `Dimensiones de máscara inesperadas: ${dims.join(" × ")}`
  );
}

const alpha = new Uint8ClampedArray(maskWidth * maskHeight);

for (let i = 0; i < values.length; i++) {
  const logit = Number(values[i]);

  if (!Number.isFinite(logit)) {
    throw new Error("La máscara contiene valores inválidos.");
  }

  const probability = 1 / (1 + Math.exp(-logit));
  alpha[i] = Math.round(probability * 255);
}

return createTransparentPng(
  imageFile,
  alpha,
  maskWidth,
  maskHeight
);
}