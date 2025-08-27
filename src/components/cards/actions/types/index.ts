export default interface CardProduct {
  id: number;
  image: string | undefined;
  name: string;
  price: number;
  gender?: string;
  sizes?: number[];
}
