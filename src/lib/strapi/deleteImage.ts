export async function deleteImage(
  imageId: number,
  token: string
): Promise<void> {
  const res = await fetch(
    `https://shoes-shop-strapi.herokuapp.com/api/upload/files/${imageId}`,
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
