import { getQueryClient } from "@/lib/get-query-client";
import { QueryClient } from "@tanstack/react-query";

let isServerMock = true;

jest.mock("@tanstack/react-query", () => {
  const actual = jest.requireActual("@tanstack/react-query");
  return {
    ...actual,
    get isServer() {
      return isServerMock;
    },
  };
});

describe("getQueryClient", () => {
  beforeEach(() => {
    isServerMock = true;
  });

  it("creates a new QueryClient on server", () => {
    isServerMock = true;

    const client1 = getQueryClient();
    const client2 = getQueryClient();

    expect(client1).not.toBe(client2);
    expect(client1).toBeInstanceOf(QueryClient);
    expect(client2).toBeInstanceOf(QueryClient);
  });

  it("returns the same QueryClient instance on client", () => {
    isServerMock = false;

    const client1 = getQueryClient();
    const client2 = getQueryClient();

    expect(client1).toBe(client2);
    expect(client1).toBeInstanceOf(QueryClient);
  });
});
