/**
 * Uploads an array of image files to the Strapi API and returns their uploaded IDs.
 *
 * This function sends a `multipart/form-data` POST request to the `/upload` endpoint
 * of the Strapi server. The server responds with metadata about the uploaded files,
 * from which this function extracts and returns only the image `id`s.
 *
 * @async
 * @function
 * @param {File[]} files - Array of `File` objects (e.g., from an input element).
 * @throws {Error} If the upload request fails or returns a non-OK response.
 * @returns {Promise<number[]>} A promise that resolves to an array of uploaded image IDs.
 *
 * @example
 * const ids = await uploadImages([file1, file2]);
 * // Output: [7163, 7164]
 */

export async function uploadImages(files: File[]): Promise<number[]> {
  const formData = new FormData();
  files.forEach((file) => formData.append("files", file));

  const res = await fetch(
    "https://shoes-shop-strapi.herokuapp.com/api/upload",
    {
      method: "POST",
      body: formData,
    }
  );

  if (!res.ok) throw new Error("Image upload failed");
  const body = (await res.json()) as { id: number }[];
  return body.map((img) => img.id);
}
