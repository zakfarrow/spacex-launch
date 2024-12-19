import { render, screen, fireEvent, within } from "@testing-library/react";
import "@testing-library/jest-dom";
import { BrowserRouter } from "react-router-dom";
import LaunchDataTable from "@/components/LaunchDataTable";
import LaunchProvider from "@/contexts/LaunchProvider";
import * as LaunchContextHooks from "@/hooks/useLaunchContext";
import { Launch } from "@/types/launch";

const mockLaunches: Launch[] = [
  {
    name: "Mission 1",
    date_utc: "2024-01-01T00:00:00.000Z",
    id: "rocket1",
    launchpad: "pad1",
    success: true,
    details: "First mission details",
  },
  {
    name: "Mission 2",
    date_utc: "2024-02-01T00:00:00.000Z",
    id: "rocket2",
    launchpad: "pad2",
    success: false,
    details: null,
  },
];

const mockRefreshLaunches = jest.fn();
const mockSetLaunches = jest.fn();

const defaultMockContext = {
  launches: mockLaunches,
  isLoading: false,
  error: null,
  refreshLaunches: mockRefreshLaunches,
  setLaunches: mockSetLaunches,
};

const createMockContext = (overrides = {}) => ({
  ...defaultMockContext,
  ...overrides,
});

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

jest.mock("@/hooks/useLaunchContext", () => ({
  useLaunchContext: jest.fn(() => defaultMockContext),
}));

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <LaunchProvider>
      <BrowserRouter>{ui}</BrowserRouter>
    </LaunchProvider>
  );
};

describe("LaunchDataTable", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (LaunchContextHooks.useLaunchContext as jest.Mock).mockImplementation(
      () => defaultMockContext
    );
  });

  describe("Loading and Error States", () => {
    it("displays loading spinner when loading", () => {
      (LaunchContextHooks.useLaunchContext as jest.Mock).mockImplementation(
        () => createMockContext({ isLoading: true })
      );

      renderWithProviders(<LaunchDataTable />);
      expect(screen.getByRole("progressbar")).toBeInTheDocument();
      expect(screen.queryByRole("table")).not.toBeInTheDocument();
    });

    it("shows error message when error exists", () => {
      const errorMessage = "Failed to fetch launch data";
      (LaunchContextHooks.useLaunchContext as jest.Mock).mockImplementation(
        () => createMockContext({ error: errorMessage, launches: [] })
      );

      renderWithProviders(<LaunchDataTable />);
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
      expect(screen.queryByRole("table")).not.toBeInTheDocument();
    });
  });

  describe("Table Structure", () => {
    it("renders all required column headers", () => {
      renderWithProviders(<LaunchDataTable />);

      expect(screen.getByText("Rocket ID")).toBeInTheDocument();
      expect(screen.getByText("Name")).toBeInTheDocument();
      expect(screen.getByText("Launch Date")).toBeInTheDocument();
      expect(screen.getByText("Details")).toBeInTheDocument();
    });

    it("displays correct launch information", () => {
      renderWithProviders(<LaunchDataTable />);

      expect(screen.getByText("Mission 1")).toBeInTheDocument();
      expect(screen.getByText("rocket1")).toBeInTheDocument();
      expect(screen.getByText("First mission details")).toBeInTheDocument();
      expect(screen.getByText("1 Jan 2024")).toBeInTheDocument();
    });

    it('shows "No details available" for null details', () => {
      renderWithProviders(<LaunchDataTable />);
      expect(screen.getByText("No details available")).toBeInTheDocument();
    });
  });

  describe("Refresh Functionality", () => {
    it("refreshes data when refresh button is clicked", async () => {
      renderWithProviders(<LaunchDataTable />);

      const refreshButton = screen.getByLabelText("Refresh data");
      expect(refreshButton).toBeEnabled();

      fireEvent.click(refreshButton);
      expect(mockRefreshLaunches).toHaveBeenCalledTimes(1);
    });
  });

  describe("Navigation", () => {
    it("navigates to summary when row is clicked", () => {
      renderWithProviders(<LaunchDataTable />);

      const firstRow = screen.getByText("Mission 1").closest("tr");
      fireEvent.click(firstRow!);

      expect(mockNavigate).toHaveBeenCalledWith("/summary/rocket1");
    });

    it("handles navigation with special characters in rocket ID", () => {
      const mockLaunchWithSpecialChars = [
        {
          id: "rocket/1",
          name: "Test Mission",
          date_utc: "2024-01-01T00:00:00.000Z",
          launchpad: "pad1",
          success: true,
          details: "Test details",
        },
      ];

      (LaunchContextHooks.useLaunchContext as jest.Mock).mockImplementation(
        () => createMockContext({ launches: mockLaunchWithSpecialChars })
      );

      renderWithProviders(<LaunchDataTable />);

      const row = screen.getByText("Test Mission").closest("tr");
      fireEvent.click(row!);

      expect(mockNavigate).toHaveBeenCalledWith("/summary/rocket/1");
    });
  });

  describe("Sorting", () => {
    it("sorts by name in ascending and descending order", () => {
      renderWithProviders(<LaunchDataTable />);

      const nameHeader = screen.getByRole("columnheader", { name: /Name/i });
      const sortLabel = within(nameHeader).getByRole("button");

      // First click - ascending
      fireEvent.click(sortLabel);
      let rows = screen.getAllByRole("row");
      expect(within(rows[1]).getByText("Mission 1")).toBeInTheDocument();

      // Second click - descending
      fireEvent.click(sortLabel);
      rows = screen.getAllByRole("row");
      expect(within(rows[1]).getByText("Mission 2")).toBeInTheDocument();
    });

    it("sorts by date in ascending and descending order", () => {
      renderWithProviders(<LaunchDataTable />);

      const dateHeader = screen.getByRole("columnheader", {
        name: /Launch Date/i,
      });
      const sortLabel = within(dateHeader).getByRole("button");

      // First click - ascending
      fireEvent.click(sortLabel);
      let rows = screen.getAllByRole("row");
      expect(within(rows[1]).getByText("1 Jan 2024")).toBeInTheDocument();

      // Second click - descending
      fireEvent.click(sortLabel);
      rows = screen.getAllByRole("row");
      expect(within(rows[1]).getByText("1 Feb 2024")).toBeInTheDocument();
    });

    it("sorts by name with special characters", () => {
      const mockLaunchesWithSpecialChars = [
        {
          id: "rocket1",
          name: "Zürich Mission",
          date_utc: "2024-01-01T00:00:00.000Z",
          launchpad: "pad1",
          success: true,
          details: "Test details",
        },
        {
          id: "rocket2",
          name: "Athens Mission",
          date_utc: "2024-02-01T00:00:00.000Z",
          launchpad: "pad2",
          success: false,
          details: null,
        },
      ];

      (LaunchContextHooks.useLaunchContext as jest.Mock).mockImplementation(
        () => createMockContext({ launches: mockLaunchesWithSpecialChars })
      );

      renderWithProviders(<LaunchDataTable />);

      const nameHeader = screen.getByRole("columnheader", { name: /Name/i });
      const sortLabel = within(nameHeader).getByRole("button");

      fireEvent.click(sortLabel);

      const rows = screen.getAllByRole("row");
      expect(within(rows[1]).getByText("Athens Mission")).toBeInTheDocument();
      expect(within(rows[2]).getByText("Zürich Mission")).toBeInTheDocument();
    });
  });

  describe("Pagination", () => {
    it("changes rows per page", () => {
      renderWithProviders(<LaunchDataTable />);

      const select = screen.getByLabelText("Rows per page:");
      fireEvent.mouseDown(select);
      const option = screen.getByRole("option", { name: "10" });
      fireEvent.click(option);

      expect(select).toHaveTextContent("10");
    });

    it("handles last page with fewer items than rows per page", () => {
      const lotsOfLaunches = Array(7)
        .fill(mockLaunches[0])
        .map((launch, index) => ({
          ...launch,
          name: `Mission ${index + 1}`,
        }));

      (LaunchContextHooks.useLaunchContext as jest.Mock).mockImplementation(
        () => createMockContext({ launches: lotsOfLaunches })
      );

      renderWithProviders(<LaunchDataTable />);

      const lastPageButton = screen.getByTitle("Go to last page");
      fireEvent.click(lastPageButton);

      const rows = screen.getAllByRole("row");
      // Header + 2 data rows (7 items, 5 per page = 2 items on last page)
      expect(rows).toHaveLength(3);
    });

    it("handles empty data set", () => {
      (LaunchContextHooks.useLaunchContext as jest.Mock).mockImplementation(
        () => createMockContext({ launches: [] })
      );

      renderWithProviders(<LaunchDataTable />);

      const table = screen.getByRole("table");
      expect(table).toBeInTheDocument();
      const rows = screen.getAllByRole("row");
      // Should only have header row
      expect(rows).toHaveLength(1);
    });
  });
});
