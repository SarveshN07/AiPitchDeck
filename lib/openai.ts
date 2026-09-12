import OpenAI from "openai"

const IMAGE_MODEL = "gpt-image-1-mini";
const IMAGE_SIZE = "1024x1024"

let openaiClient: OpenAI | null = null;

function getOpenAIClient(): OpenAI {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error(
      "Missing OPENAI_API_KEY in .env — create one at https://platform.openai.com/api-keys",
    );
  }

  if (!openaiClient) {
    openaiClient = new OpenAI({ apiKey });
  }

  return openaiClient;
}


async function fetchPlaceholderImage(): Promise<Buffer> {
  const response = await fetch("https://picsum.photos/1024/1024");

  if (!response.ok) {
    throw new Error("Could not download placeholder image");
  }

  const bytes = await response.arrayBuffer();
  return Buffer.from(bytes);
}

async function createImageWithOpenAI(prompt: string): Promise<Buffer> {
  const openai = getOpenAIClient();

  const response = await openai.images.generate({
    model: IMAGE_MODEL,
    prompt,
    n: 1,
    size: IMAGE_SIZE,
  });

  const base64Image = response.data?.[0]?.b64_json;

  if (!base64Image) {
    throw new Error(
      "OpenAI returned no image — check your API credits or try again",
    );
  }

  return Buffer.from(base64Image, "base64");
}

export async function generateSlideImage(prompt: string): Promise<Buffer> {
  if (process.env.USE_PLACEHOLDER_IMAGES === "true") {
    return fetchPlaceholderImage();
  }

  return createImageWithOpenAI(prompt);
}