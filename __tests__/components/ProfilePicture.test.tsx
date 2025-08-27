import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { ProfilePicture } from "@/components/ProfilePicture";

jest.mock("@mui/material", () => {
  const actual = jest.requireActual(
    "@mui/material"
  ) as typeof import("@mui/material");
  const ReactLib = jest.requireActual("react") as typeof import("react");

  const MockAvatar = ReactLib.forwardRef<HTMLDivElement, any>(
    function MockAvatar(props, ref) {
      const { sx, alt, src, ...rest } = props;
      return (
        <div
          data-testid="mui-avatar"
          data-sx-border={sx?.border}
          ref={ref}
          {...rest}
        >
          <img alt={alt} src={src} />
        </div>
      );
    }
  );

  return { ...actual, Avatar: MockAvatar };
});

describe("ProfilePicture", () => {
  const SRC = "https://example.com/avatar.jpg";

  it("renders the avatar image with provided src and alt", () => {
    render(<ProfilePicture src={SRC} alt="User avatar" width={40} />);
    const img = screen.getByRole("img", { name: /user avatar/i });
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", SRC);
    expect(img).toHaveAttribute("alt", "User avatar");
  });

  it("uses default alt when none provided", () => {
    render(<ProfilePicture src={SRC} width={40} />);
    const img = screen.getByRole("img", { name: /profile picture/i });
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("alt", "Profile picture");
  });

  it("shows tooltip with alt text on hover", async () => {
    const user = userEvent.setup();
    render(<ProfilePicture src={SRC} alt="User avatar" width={40} />);
    const img = screen.getByRole("img", { name: /user avatar/i });
    await user.hover(img);
    expect(await screen.findByText(/user avatar/i)).toBeInTheDocument();
  });

  it("calls onClick when clicked", async () => {
    const user = userEvent.setup();
    const onClick = jest.fn();
    render(
      <ProfilePicture src={SRC} alt="Clickable" width={40} onClick={onClick} />
    );
    await user.click(screen.getByRole("img", { name: /clickable/i }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("sets sx.border when border=true (via mocked Avatar)", () => {
    render(<ProfilePicture src={SRC} alt="Border on" width={40} border />);
    const avatar = screen.getByTestId("mui-avatar");
    expect(avatar).toHaveAttribute("data-sx-border", "5px solid white");
  });

  it("sets sx.border='none' when border=false (via mocked Avatar)", () => {
    render(
      <ProfilePicture src={SRC} alt="Border off" width={40} border={false} />
    );
    const avatar = screen.getByTestId("mui-avatar");
    expect(avatar).toHaveAttribute("data-sx-border", "none");
  });

  it("accepts numeric width", () => {
    render(<ProfilePicture src={SRC} alt="Num width" width={48} />);
    expect(screen.getByRole("img", { name: /num width/i })).toBeInTheDocument();
  });

  it("accepts responsive object width", () => {
    render(
      <ProfilePicture
        src={SRC}
        alt="Responsive width"
        width={{ xs: 32, md: 56 } as unknown as number}
      />
    );
    expect(
      screen.getByRole("img", { name: /responsive width/i })
    ).toBeInTheDocument();
  });
});
