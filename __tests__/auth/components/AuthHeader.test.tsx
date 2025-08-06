import "@testing-library/jest-dom";
import { render, screen } from "../../utils/test-utils";
import AuthHeader from "@/app/auth/components/AuthHeader";

describe("AuthHeader Component", () => {
  const defaultProps = {
    title: "Welcome Back",
    subtitle: "Please sign in to your account",
  };

  it("renders title and subtitle correctly", () => {
    render(<AuthHeader {...defaultProps} />);

    expect(screen.getByText("Welcome Back")).toBeInTheDocument();
    expect(
      screen.getByText("Please sign in to your account")
    ).toBeInTheDocument();
  });

  it("renders with different title and subtitle", () => {
    const customProps = {
      title: "Create Account",
      subtitle: "Join us today",
    };

    render(<AuthHeader {...customProps} />);

    expect(screen.getByText("Create Account")).toBeInTheDocument();
    expect(screen.getByText("Join us today")).toBeInTheDocument();
  });
});
