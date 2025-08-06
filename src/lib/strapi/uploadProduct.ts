type ProductFormData = {
  name: string;
  color: number;
  gender: number;
  brand: number;
  description: string;
  price: number;
  sizes: number[];
  userId: number;
};

export async function createProduct(
  payload: ProductFormData,
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
