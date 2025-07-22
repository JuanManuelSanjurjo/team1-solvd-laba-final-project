import AsideImage from "../components/AsideImage";
import Testimonials from "./components/Testimonials";
import AuthHeader from "../components/AuthHeader";
import MainContainer from "../components/MainContainer";
import LeftBoxFormContainer from "../components/LeftBoxFormContainer";
import AuthLogo from "../components/AuthLogo";

export default function SignUp() {
  return (
    <MainContainer>
      <AuthLogo />
      <LeftBoxFormContainer>
        <AuthHeader
          title="Create an account"
          subtitle="Create an account to get an easy access to your dream shopping"
        />
      </LeftBoxFormContainer>
      <AsideImage imageUrl="/assets/images/auth-aside.jpg" alt="Sneakers image">
        <Testimonials variant="testimonials" />
      </AsideImage>
    </MainContainer>
  );
}
