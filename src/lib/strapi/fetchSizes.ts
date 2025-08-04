interface Size {
  id: number;
  attributes: {
    value: number;
  };
}

export async function fetchSizes() {
  const res = await fetch("https://shoes-shop-strapi.herokuapp.com/api/sizes", {
    next: { revalidate: 3600 },
  });

  if (!res.ok) throw new Error("Failed to fetch sizes");

  const json = await res.json();

  return json.data.map((size: Size) => ({
    label: size.attributes.value,
    value: size.id,
  }));
}
