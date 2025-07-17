// src/app/fonts.ts
import { Work_Sans } from 'next/font/google';

export const worksans = Work_Sans({
  subsets: ['latin'],
  variable: '--font-worksans',
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
});
