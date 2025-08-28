export async function fetchRecommendations(ids: number[]) {
  const res = await fetch("/api/ia/recommendations", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ids }),
  });
  if (!res.ok) throw new Error("Failed to fetch recommendations");
  return res.json();
}
