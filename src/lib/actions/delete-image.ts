/**
 * @action
 * @param {number} imageId - The ID of the image to delete.
 * @param {string} token - The authentication token.
 * @returns {Promise<void>} - A promise that resolves when the image is deleted.
 *
 * @example
 * await deleteImage(imageId, token);
 */
export async function deleteImage(
  imageId: number,
  token: string
): Promise<void> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/upload/files/${imageId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error(`Failed to delete image with ID ${imageId}`);
  }
}
