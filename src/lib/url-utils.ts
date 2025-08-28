/**
 * url-utils.ts
 *
 * Utilities for converting remote image URLs into File objects suitable for
 * uploading (e.g. to Strapi) and for generating random filenames.
 *
 * Notes:
 * - `urlToFile` performs a `fetch` to download the resource; this can fail due to
 *   network errors or CORS restrictions on the remote host.
 * - `generateRandomFileName` uses `crypto.randomUUID()` to create a UUID-based filename.
 *   This API is available in modern browsers and Node 18+. If you need to support
 *   older runtimes, provide a fallback implementation for `crypto.randomUUID`.
 */

/**
 * Convert a remote resource URL into a `File` object.
 *
 * The function:
 * 1. Fetches the URL.
 * 2. Converts the response to a Blob.
 * 3. Derives a file extension from the blob MIME type (falls back to "jpg").
 * 4. Generates a random filename and returns a new `File` instance.
 *
 * @async
 * @param {string} url - The remote URL of the resource (image).
 * @returns {Promise<File>} A promise that resolves to a `File` containing the downloaded data.
 *
 * @throws {TypeError} If `fetch` fails (network error) or the response can't be converted to a Blob.
 * @throws {Error} If your environment doesn't support `File` or `crypto.randomUUID`.
 *
 * @example
 * // usage in client-side code
 * const file = await urlToFile("https://example.com/image.png");
 * // file.name -> "b3f1c9e0-... .png"
 *
 */
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
