export async function urlToFile(url: string): Promise<File> {
  const response = await fetch(url);
  const blob = await response.blob();

  const mimeType = blob.type;
  const extension = mimeType.split("/")[1] || "jpg";

  const fileName = generateRandomFileName(extension);

  return new File([blob], fileName, { type: blob.type });
}
export function generateRandomFileName(extension = "jpg") {
  return `${crypto.randomUUID()}.${extension}`;
}
