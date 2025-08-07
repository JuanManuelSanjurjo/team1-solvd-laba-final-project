export async function fetchUserProducts(userId: number, token: string) {
  const response = await fetch(
    `https://shoes-shop-strapi.herokuapp.com/api/users/${userId}?populate[products][populate]=*
`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) throw new Error("Network response was not ok");
  const json = await response.json();
  console.log(json.products);
  return json.products;
}
