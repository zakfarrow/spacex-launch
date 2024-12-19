import React from "react";

export interface Launch {
  id: string;
  name: string;
  date_utc: string;
  launchpad: string | null;
  success: boolean | null;
  details: string | null;
}

export interface LaunchContextType {
  launches: Launch[];
  isLoading: boolean;
  error: string | null;
  setLaunches: React.Dispatch<React.SetStateAction<Launch[]>>;
  refreshLaunches: () => Promise<void>;
}
