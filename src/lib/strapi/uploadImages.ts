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
  const body = await res.json();
  return body.map((img: any) => img.id);
}
