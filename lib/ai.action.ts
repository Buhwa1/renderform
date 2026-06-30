// ai.action.ts
import puter from "@heyputer/puter.js";
import { ROOMIFY_RENDER_PROMPT, ROOMIFY_IMAGE_MODEL } from "./constants";

export const fetchAsDataUrl = async (url: string): Promise<string> => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch image: ${response.statusText}`);
  }
  const blob = await response.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

interface Generate3DViewParams {
  sourceImage: string;
}

interface Generate3DViewResult {
  renderedImage: string | null;
  renderedPath: undefined;
}

export const generate3DView = async ({
  sourceImage,
}: Generate3DViewParams): Promise<Generate3DViewResult> => {
  const dataUrl = sourceImage.startsWith("data:")
    ? sourceImage
    : await fetchAsDataUrl(sourceImage);

  const base64Data = dataUrl.split(",")[1];
  const mimeType = dataUrl.split(";")[0].split(":")[1];

  if (!mimeType || !base64Data) {
    throw new Error("Invalid source image payload");
  }

  // txt2img is correct here — Puter's own docs confirm input_image +
  // input_image_mime_type is the supported image-conditioning path for
  // Gemini image models, NOT puter.ai.chat (which rejected the model name).
  let response;
  try {
    response = await puter.ai.txt2img(ROOMIFY_RENDER_PROMPT, {
      model: ROOMIFY_IMAGE_MODEL,
      input_image: base64Data,
      input_image_mime_type: mimeType,
    });
  } catch (err: any) {
    console.error("generate3DView: txt2img call failed", err);
    throw new Error(
      err?.error?.message || err?.message || "Image generation request failed"
    );
  }

  const rawImageUrl = (response as HTMLImageElement)?.src ?? null;

  if (!rawImageUrl) {
    console.error("generate3DView: no image returned from model", response);
    return { renderedImage: null, renderedPath: undefined };
  }

  const renderedImage = rawImageUrl.startsWith("data:")
    ? rawImageUrl
    : await fetchAsDataUrl(rawImageUrl);

  return { renderedImage, renderedPath: undefined };
};