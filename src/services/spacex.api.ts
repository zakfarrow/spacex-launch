import axios from "axios";
import { Launch } from "@/types/launch";

const BASE_URL = "https://api.spacexdata.com/v4";

export const getLaunches = async (): Promise<Launch[]> => {
  try {
    const response = await axios.get<Launch[]>(`${BASE_URL}/launches`);
    return response.data;
  } catch (error) {
    console.error("Error fetching launches:", error);
    throw error;
  }
};
