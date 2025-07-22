import { Box } from "@mui/material";
import Image from "next/image";

export default function AuthLogo() {
  return (
    <Box sx={{ position: "absolute", top: "50px", left: "40px" }}>
      <Image
        src="/assets/logo/logo-black.svg"
        alt="Shoes Shop Logo"
        width={40}
        height={30}
      />
    </Box>
  );
}
