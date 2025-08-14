export async function generateDescription(name: string): Promise<string> {
  const res = await fetch("/api/ia/generate-description", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });

  if (!res.ok) {
    throw new Error("Failed to generate description");
  }

  const data = await res.json();
  return data.description || "";
}
