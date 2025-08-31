import Layout from "@/app/(side-bar)/layout";
import { render, screen } from "__tests__/utils/test-utils";

jest.mock("@/auth", () => ({
  auth: jest.fn(),
}));

jest.mock("@/components/AuthenticatedSidebar", () => {
  return function MockAuthenticatedSidebar() {
    return (
      <div data-testid="authenticated-sidebar">Authenticated Sidebar Mock</div>
    );
  };
});

describe("Sidebar Layout", () => {
  it("should render without crashing", async () => {
    const layoutComponent = await Layout({
      children: <h1>Layout test</h1>,
    });

    render(layoutComponent);

    expect(screen.getByText("Layout test")).toBeInTheDocument();
  });
});
