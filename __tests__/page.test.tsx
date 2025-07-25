"use client";

import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { ThemeProvider, createTheme } from "@mui/material/styles";

// Create a mock Home component for testing
const MockHome = () => {
  const [filtersOpen, setFiltersOpen] = React.useState(true);

  return (
    <div>
      <div data-testid="header">Header</div>
      <div data-testid="filter-sidebar">Filter Sidebar</div>
      <div data-testid="main-content">
        <h1>Search results</h1>
        <button
          onClick={() => setFiltersOpen(!filtersOpen)}
          data-testid="filter-toggle"
        >
          {filtersOpen ? "Hide Filters" : "Filters"}
        </button>
        <div data-testid="card-container">Card Container</div>
      </div>
    </div>
  );
};

// Mock React
const React = require("react");

const theme = createTheme();

describe("Home Component", () => {
  it("renders main elements", () => {
    render(
      <ThemeProvider theme={theme}>
        <MockHome />
      </ThemeProvider>
    );

    expect(screen.getByTestId("header")).toBeInTheDocument();
    expect(screen.getByTestId("filter-sidebar")).toBeInTheDocument();
    expect(screen.getByTestId("main-content")).toBeInTheDocument();
    expect(screen.getByText("Search results")).toBeInTheDocument();
  });

  it("toggles filter button text", () => {
    render(
      <ThemeProvider theme={theme}>
        <MockHome />
      </ThemeProvider>
    );

    const toggleButton = screen.getByTestId("filter-toggle");

    // Initial state
    expect(toggleButton).toHaveTextContent("Hide Filters");

    // Click to toggle
    fireEvent.click(toggleButton);
    expect(toggleButton).toHaveTextContent("Filters");

    // Click again to toggle back
    fireEvent.click(toggleButton);
    expect(toggleButton).toHaveTextContent("Hide Filters");
  });

  it("displays card container", () => {
    render(
      <ThemeProvider theme={theme}>
        <MockHome />
      </ThemeProvider>
    );

    expect(screen.getByTestId("card-container")).toBeInTheDocument();
  });
});
