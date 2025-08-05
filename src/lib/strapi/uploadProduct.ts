export async function createProduct(
  payload: any,
  token: string
): Promise<void> {
  const res = await fetch(
    "https://shoes-shop-strapi.herokuapp.com/api/products",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    }
  );

  if (!res.ok) throw new Error("Product creation failed");
}
