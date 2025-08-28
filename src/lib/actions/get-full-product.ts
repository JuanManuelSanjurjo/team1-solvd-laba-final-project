export async function getFullProduct(id: string) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/products/${id}?populate=*`,
      { cache: "no-store" }
    );
    const responseData = await response.json();
    return responseData || { data: null };
  } catch (error) {
    console.log(error); // placeholder for error handling
  }
}
