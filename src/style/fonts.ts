import { Work_Sans } from "next/font/google";
import { Nunito_Sans } from "next/font/google";

export const worksans = Work_Sans({
  subsets: ["latin"],
  variable: "--font-worksans",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const nunitosans = Nunito_Sans({
  subsets: ["latin"],
  variable: "--font-nunitosans",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});
