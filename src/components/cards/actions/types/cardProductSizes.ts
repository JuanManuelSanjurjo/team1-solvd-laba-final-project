export default interface CardProductSizes {
  id: number;
  image: string | undefined;
  name: string;
  price: number;
  gender?: string;
  sizes: number[];
}
