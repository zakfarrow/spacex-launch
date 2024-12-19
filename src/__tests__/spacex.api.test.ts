import axios from "axios";
import { getLaunches } from "@/services/spacex.api";

// Mock axios
jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("SpaceX API Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getLaunches", () => {
    const mockApiResponse = [
      {
        id: "rocket1",
        name: "Mission 1",
        date_utc: "2024-01-01T00:00:00.000Z",
        launchpad: "pad1",
        success: true,
        details: "Test mission details",
      },
      {
        id: "rocket2",
        name: "Mission 2",
        date_utc: "2024-02-01T00:00:00.000Z",
        launchpad: "pad2",
        success: false,
        details: null,
      },
    ];

    const expectedTransformedData = [
      {
        rocket_id: "rocket1",
        name: "Mission 1",
        date_utc: "2024-01-01T00:00:00.000Z",
        launchpad_id: "pad1",
        success: true,
        details: "Test mission details",
      },
      {
        rocket_id: "rocket2",
        name: "Mission 2",
        date_utc: "2024-02-01T00:00:00.000Z",
        launchpad_id: "pad2",
        success: false,
        details: null,
      },
    ];

    it("successfully fetches and transforms launch data", async () => {
      // Mock the axios get call
      mockedAxios.get.mockResolvedValueOnce({ data: mockApiResponse });

      // Call the function
      const result = await getLaunches();

      // Test API call
      expect(mockedAxios.get).toHaveBeenCalledTimes(1);
      expect(mockedAxios.get).toHaveBeenCalledWith(
        "https://api.spacexdata.com/v4/launches"
      );

      // Test data transformation
      expect(result).toEqual(expectedTransformedData);
    });

    it("handles API errors correctly", async () => {
      // Mock the API error
      const error = new Error("API Error");
      mockedAxios.get.mockRejectedValueOnce(error);

      // Mock console.error to prevent error output in tests
      const consoleSpy = jest.spyOn(console, "error").mockImplementation();

      // Test error handling
      await expect(getLaunches()).rejects.toThrow("API Error");

      // Verify error was logged
      expect(consoleSpy).toHaveBeenCalledWith(
        "Error fetching launches:",
        error
      );

      // Clean up
      consoleSpy.mockRestore();
    });

    it("handles empty response data", async () => {
      // Mock empty response
      mockedAxios.get.mockResolvedValueOnce({ data: [] });

      const result = await getLaunches();

      expect(result).toEqual([]);
      expect(mockedAxios.get).toHaveBeenCalledTimes(1);
    });

    it("handles malformed response data", async () => {
      // Mock malformed response
      const malformedData = [
        {
          id: "rocket1",
          // Missing some fields
          name: "Mission 1",
          success: true,
        },
      ];

      mockedAxios.get.mockResolvedValueOnce({ data: malformedData });

      const result = await getLaunches();

      expect(result).toEqual([
        {
          rocket_id: "rocket1",
          name: "Mission 1",
          date_utc: undefined,
          launchpad_id: undefined,
          success: true,
          details: undefined,
        },
      ]);
    });
  });
});
