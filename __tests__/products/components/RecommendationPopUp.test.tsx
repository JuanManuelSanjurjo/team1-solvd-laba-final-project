import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import RecommendationPopup from "@/app/products/components/RecommendationPopUp";
import { fetchRecommendations } from "@/lib/ai/generate-filter-recommendations";

const replaceMock = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({ replace: replaceMock }),
}));

type CardProduct = { id: number; [k: string]: any };
const mockState = {
  byUser: {} as Record<string, CardProduct[]>,
};

jest.mock("@/store/recently-viewed-store", () => ({
  useRecentlyViewedStore: (selector: any) => selector(mockState),
}));

jest.mock("@/lib/ai/generate-filter-recommendations", () => ({
  fetchRecommendations: jest.fn(),
}));

function renderWithClient(ui: React.ReactElement) {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={client}>{ui}</QueryClientProvider>
  );
}

function setRecentlyViewed(userId: string, ids: number[]) {
  mockState.byUser[userId] = ids.map((id) => ({ id }));
}

const findPopupTitle = () =>
  screen.queryByText("We found recommended filters for you");

describe("RecommendationPopup", () => {
  const userId = "u-1";
  const cacheKey = (id = userId) => `recs_cache_${id}`;

  beforeEach(() => {
    jest.resetAllMocks();
    sessionStorage.clear();
    mockState.byUser = {};
  });

  it("renders nothing when there are no recently viewed ids", () => {
    renderWithClient(<RecommendationPopup userId={userId} />);
    expect(findPopupTitle()).not.toBeInTheDocument();
    expect(fetchRecommendations).not.toHaveBeenCalled();
  });

  it("does not fetch or render if fewer than 5 ids (enabled=false)", () => {
    setRecentlyViewed(userId, [10, 20, 30, 40]);
    renderWithClient(<RecommendationPopup userId={userId} />);
    expect(findPopupTitle()).not.toBeInTheDocument();
    expect(fetchRecommendations).not.toHaveBeenCalled();
  });

  it("renders popup with fetched data when 5+ ids and redirectUrl present", async () => {
    setRecentlyViewed(userId, [5, 2, 9, 1, 7]);
    (fetchRecommendations as jest.Mock).mockResolvedValue({
      redirectUrl: "/?brand=Nike",
      ai: { explain_short: "Because you liked running shoes" },
    });

    renderWithClient(<RecommendationPopup userId={userId} />);

    const title = await screen.findByText(
      "We found recommended filters for you"
    );
    expect(title).toBeInTheDocument();
    expect(
      screen.getByText("Because you liked running shoes")
    ).toBeInTheDocument();

    const applyBtn = screen.getByRole("button", { name: /apply/i });
    fireEvent.click(applyBtn);

    expect(sessionStorage.getItem("recs_shown_for")).toBe("/?brand=Nike");
    expect(replaceMock).toHaveBeenCalledWith("/products/?brand=Nike");
  });

  it("hides after clicking the close icon (dismiss)", async () => {
    setRecentlyViewed(userId, [1, 2, 3, 4, 5]);
    (fetchRecommendations as jest.Mock).mockResolvedValue({
      redirectUrl: "/?foo=bar",
      ai: null,
    });

    renderWithClient(<RecommendationPopup userId={userId} />);

    expect(await screen.findByText(/recommended filters/i)).toBeInTheDocument();

    const closeBtn = screen.getByRole("button", { name: "" });
    fireEvent.click(closeBtn);

    expect(findPopupTitle()).not.toBeInTheDocument();
  });

  it("uses cached initial data from sessionStorage (no network call) when cache is fresh", async () => {
    const cached = {
      ts: Date.now(),
      data: {
        redirectUrl: "/?cat=boots",
        ai: { explain_short: "Similar to your recent pairs" },
      },
    };
    sessionStorage.setItem(cacheKey(), JSON.stringify(cached));

    setRecentlyViewed(userId, [10, 11, 12, 13, 14]);

    renderWithClient(<RecommendationPopup userId={userId} />);

    expect(
      await screen.findByText("We found recommended filters for you")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Similar to your recent pairs")
    ).toBeInTheDocument();
    expect(fetchRecommendations).not.toHaveBeenCalled();
  });

  it("does not show when redirectUrl is '/' (shouldShow=false)", async () => {
    setRecentlyViewed(userId, [1, 2, 3, 4, 5]);
    (fetchRecommendations as jest.Mock).mockResolvedValue({
      redirectUrl: "/",
      ai: { explain_short: "ignored" },
    });

    renderWithClient(<RecommendationPopup userId={userId} />);

    expect(findPopupTitle()).not.toBeInTheDocument();
  });
});
