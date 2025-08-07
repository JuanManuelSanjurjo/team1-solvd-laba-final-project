export async function fetchUserProducts() {
  const response = await fetch(
    "https://shoes-shop-strapi.herokuapp.com/api/products?populate=*"
  );
  if (!response.ok) throw new Error("Network response was not ok");
  const json = await response.json();
  return json.data;
}
