import axios from "axios";
import { getLaunches } from "@/services/spacex.api";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("SpaceX API Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedAxios.get.mockClear();
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

    it("successfully fetches launch data", async () => {
      mockedAxios.get.mockResolvedValueOnce({ data: mockApiResponse });
      const result = await getLaunches();

      expect(mockedAxios.get).toHaveBeenCalledTimes(1);
      expect(mockedAxios.get).toHaveBeenCalledWith(
        "https://api.spacexdata.com/v4/launches"
      );
      expect(result).toEqual(mockApiResponse);
    });

    it("handles API errors correctly", async () => {
      const error = new Error("API Error");
      mockedAxios.get.mockRejectedValueOnce(error);

      const consoleSpy = jest.spyOn(console, "error").mockImplementation();

      await expect(getLaunches()).rejects.toThrow("API Error");

      expect(consoleSpy).toHaveBeenCalledWith(
        "Error fetching launches:",
        error
      );

      consoleSpy.mockRestore();
    });

    it("handles empty response data", async () => {
      mockedAxios.get.mockResolvedValueOnce({ data: [] });

      const result = await getLaunches();

      expect(result).toEqual([]);
      expect(mockedAxios.get).toHaveBeenCalledTimes(1);
    });

    it("handles malformed response data", async () => {
      const malformedData = [
        {
          id: "rocket1",
          name: "Mission 1",
          success: true,
        },
      ];

      mockedAxios.get.mockResolvedValueOnce({ data: malformedData });
      const result = await getLaunches();

      expect(result).toEqual(malformedData);
    });
  });
});
