import Layout from "@/app/(side-bar)/(profile)/layout";
import { render, screen } from "__tests__/utils/test-utils";

describe("Profile Layout", () => {
  it("should render without crashing", () => {
    render(
      <Layout>
        <h1>Test</h1>
      </Layout>
    );

    expect(screen.getByText("Test")).toBeInTheDocument();
  });
});
