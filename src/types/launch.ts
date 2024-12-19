import React from "react";

export interface Launch {
  name: string;
  date_utc: string;
  rocket_id: string;
  launchpad_id: string;
  success: boolean;
  details: string | null;
}

export interface LaunchContextType {
  launches: Launch[];
  isLoading: boolean;
  error: string | null;
  setLaunches: React.Dispatch<React.SetStateAction<Launch[]>>;
  refreshLaunches: () => Promise<void>;
}
