import React from "react";
import { render, screen, waitFor, act } from "@testing-library/react";
import { LaunchProvider, LaunchContext } from "@/contexts/LaunchContext";
import { getLaunches } from "@/services/spacex.api";
import { Launch } from "@/types/launch";

// Mock the API service
jest.mock("@/services/spacex.api");
const mockedGetLaunches = getLaunches as jest.MockedFunction<
  typeof getLaunches
>;

// Test component to consume context
const TestComponent = () => {
  const context = React.useContext(LaunchContext);
  if (!context) throw new Error("Context must be used within provider");

  return (
    <div>
      <div data-testid="loading">{context.isLoading.toString()}</div>
      <div data-testid="error">{context.error || "no error"}</div>
      <div data-testid="launches">{context.launches.length}</div>
      <button onClick={context.refreshLaunches}>Refresh</button>
    </div>
  );
};

describe("LaunchContext", () => {
  const mockLaunches: Launch[] = [
    {
      name: "Test Launch",
      date_utc: "2024-01-01T00:00:00.000Z",
      rocket_id: "rocket1",
      launchpad_id: "pad1",
      success: true,
      details: "Test details",
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("provides initial state and loads launches on mount", async () => {
    mockedGetLaunches.mockResolvedValueOnce(mockLaunches);

    render(
      <LaunchProvider>
        <TestComponent />
      </LaunchProvider>
    );

    // Initial state
    expect(screen.getByTestId("loading")).toHaveTextContent("true");
    expect(screen.getByTestId("error")).toHaveTextContent("no error");
    expect(screen.getByTestId("launches")).toHaveTextContent("0");

    // After data loads
    await waitFor(() => {
      expect(screen.getByTestId("loading")).toHaveTextContent("false");
      expect(screen.getByTestId("launches")).toHaveTextContent("1");
    });
  });

  it("handles API errors correctly", async () => {
    mockedGetLaunches.mockRejectedValueOnce(new Error("API Error"));

    render(
      <LaunchProvider>
        <TestComponent />
      </LaunchProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("error")).toHaveTextContent(
        "Failed to fetch launch data"
      );
      expect(screen.getByTestId("loading")).toHaveTextContent("false");
    });
  });

  it("refreshes launches when requested", async () => {
    // Set up sequential mock responses
    mockedGetLaunches
      .mockResolvedValueOnce(mockLaunches)
      .mockResolvedValueOnce([
        ...mockLaunches,
        { ...mockLaunches[0], name: "Test Launch 2" },
      ]);

    render(
      <LaunchProvider>
        <TestComponent />
      </LaunchProvider>
    );

    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByTestId("launches")).toHaveTextContent("1");
    });

    // Trigger refresh
    act(() => {
      screen.getByRole("button").click();
    });

    // Verify loading state during refresh
    expect(screen.getByTestId("loading")).toHaveTextContent("true");

    // Wait for refresh to complete
    await waitFor(() => {
      expect(screen.getByTestId("loading")).toHaveTextContent("false");
      expect(screen.getByTestId("launches")).toHaveTextContent("2");
    });
  });

  it("clears error when refreshing", async () => {
    // First call fails, second succeeds
    mockedGetLaunches
      .mockRejectedValueOnce(new Error("API Error"))
      .mockResolvedValueOnce(mockLaunches);

    render(
      <LaunchProvider>
        <TestComponent />
      </LaunchProvider>
    );

    // Wait for initial error
    await waitFor(() => {
      expect(screen.getByTestId("error")).toHaveTextContent(
        "Failed to fetch launch data"
      );
    });

    // Trigger refresh
    act(() => {
      screen.getByRole("button").click();
    });

    // Verify error is cleared and data loads
    await waitFor(() => {
      expect(screen.getByTestId("error")).toHaveTextContent("no error");
      expect(screen.getByTestId("launches")).toHaveTextContent("1");
    });
  });
});
