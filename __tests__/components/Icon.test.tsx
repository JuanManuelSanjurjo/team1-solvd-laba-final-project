import { render } from "@testing-library/react";
import Icon from "@/components/Icon";

jest.mock("iconsax-react", () => ({
  Home: (props: any) => <svg data-testid="Home" {...props} />,
  User: (props: any) => <svg data-testid="User" {...props} />,
}));

describe("Icon component", () => {
  it("renders the correct icon based on the name prop", () => {
    const { getByTestId } = render(<Icon name="Home" />);
    const icon = getByTestId("Home");
    expect(icon).toBeInTheDocument();
  });

  it("applies default props when none are provided", () => {
    const { getByTestId } = render(<Icon name="User" />);
    const icon = getByTestId("User");

    expect(icon).toHaveAttribute("size", "20");
    expect(icon).toHaveAttribute("color", "black");
    expect(icon).toHaveAttribute("variant", "Linear");
  });

  it("applies custom props correctly", () => {
    const { getByTestId } = render(
      <Icon
        name="Home"
        size={30}
        color="red"
        variant="Bold"
        className="custom"
      />,
    );
    const icon = getByTestId("Home");

    expect(icon).toHaveAttribute("size", "30");
    expect(icon).toHaveAttribute("color", "red");
    expect(icon).toHaveAttribute("variant", "Bold");
    expect(icon).toHaveClass("custom");
  });

  it("renders another icon correctly", () => {
    const { getByTestId } = render(<Icon name="User" />);
    expect(getByTestId("User")).toBeInTheDocument();
  });
});
