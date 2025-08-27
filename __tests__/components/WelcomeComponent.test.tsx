import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

jest.mock("@/components/ProfilePicture", () => {
  return {
    ProfilePicture: (props: any) => {
      const { src, alt, width, ...rest } = props;
      return (
        <img
          data-testid="profile-picture"
          alt={alt}
          src={src}
          data-width={String(width)}
          {...rest}
        />
      );
    },
  };
});

import WelcomeComponent from "@/components/WelcomeComponent";

describe("WelcomeComponent", () => {
  const SRC = "https://example.com/avatar.jpg";
  const NAME = "John Doe";

  it("renders the greeting 'Welcome'", () => {
    render(<WelcomeComponent src={SRC} name={NAME} />);
    expect(screen.getByText(/welcome/i)).toBeInTheDocument();
  });

  it("renders the user's name and sets it as title attribute", () => {
    render(<WelcomeComponent src={SRC} name={NAME} />);
    const nameElement = screen.getByText(NAME);
    expect(nameElement).toBeInTheDocument();
    expect(nameElement).toHaveAttribute("title", NAME);
  });

  it("renders the ProfilePicture with constructed alt and correct src/width", () => {
    render(<WelcomeComponent src={SRC} name={NAME} />);

    const img = screen.getByRole("img", { name: `${NAME}'s avatar` });
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", SRC);

    const mocked = screen.getByTestId("profile-picture");
    expect(mocked).toHaveAttribute("data-width", "64");
  });

  it("still renders with no name, showing the avatar and greeting", () => {
    render(<WelcomeComponent src={SRC} />);
    expect(screen.getByText(/welcome/i)).toBeInTheDocument();
    const img = screen.getByRole("img", { name: /avatar/i });
    expect(img).toBeInTheDocument();
  });
});
