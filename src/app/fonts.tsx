import { Work_Sans } from "next/font/google";
import { Nunito_Sans } from "next/font/google";

export const worksans = Work_Sans ({
    subsets: ['latin'], //Load only latin characters
    variable: '--font-work', //Define CDD variable
    display: 'swap', //Will need to discuss this 
    // weight: 
});

export const nunito = Nunito_Sans({
    subsets: ['latin'],
    variable: "--font-nunito",
    // weight: 
});