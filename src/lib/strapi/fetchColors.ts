interface Color {
  id: number;
  attributes: {
    name: string;
  };
}

export async function fetchColors() {
  const res = await fetch(
    "https://shoes-shop-strapi.herokuapp.com/api/colors",
    {
      next: { revalidate: 3600 },
    }
  );

  if (!res.ok) throw new Error("Failed to fetch colors");

  const json = await res.json();

  return json.data.map((color: Color) => ({
    label: color.attributes.name,
    value: color.id,
  }));
}
