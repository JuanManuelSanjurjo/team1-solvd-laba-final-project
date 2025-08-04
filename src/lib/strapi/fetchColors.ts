interface Color {
  id: number;
  attributes: {
    name: string;
  };
}

export async function fetchBrands() {
  const res = await fetch(
    "https://shoes-shop-strapi.herokuapp.com/api/colors",
    {
      next: { revalidate: 3600 },
    }
  );

  if (!res.ok) throw new Error("Failed to fetch brands");

  const json = await res.json();

  return json.data.map((brand: Color) => ({
    label: brand.attributes.name,
    value: brand.id,
  }));
}
