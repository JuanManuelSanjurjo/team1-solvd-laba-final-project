import { Box } from "@mui/material";
import Image from "next/image";
import Link from "next/link";

export default function AuthLogo() {
  return (
    <Box sx={{ position: "absolute", top: "50px", left: "40px" }}>
      <Link href="/">
        <Image
          src="/assets/logo/logo-black.svg"
          alt="Shoes Shop Logo"
          width={40}
          height={30}
        />
      </Link>
    </Box>
  );
}
