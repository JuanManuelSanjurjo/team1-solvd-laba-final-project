import AuthLogo from "../../../src/app/auth/components/AuthLogo";
import { render } from "../../utils/test-utils";

describe("AuthLogo", () => {
  it("renders without crashing", () => {
    render(<AuthLogo />);
  });
});
