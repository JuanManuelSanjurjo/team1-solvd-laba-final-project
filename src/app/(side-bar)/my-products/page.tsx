import MyProductsBanner from "./components/MyProductsBanner";
import MyProductsMainContent from "./components/MyProductsMainContent";

/**
 * MyProducts
 *
 * This component renders the main content of the My Products page.
 * It includes a banner, a main content section, and a sidebar.
 *
 * @component
 *
 * @returns {JSX.Element} The main content of the My Products page.
 */
export default function MyProductsPage() {
  return (
    <>
      <MyProductsBanner />
      <MyProductsMainContent />
    </>
  );
}
