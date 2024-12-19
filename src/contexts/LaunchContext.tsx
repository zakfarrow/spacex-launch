import React, { createContext, useEffect, useState } from "react";
import { Launch, LaunchContextType } from "@/types/launch";
import { getLaunches } from "@/services/spacex.api";

export const LaunchContext = createContext<LaunchContextType | undefined>(
  undefined
);

export const LaunchProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [launches, setLaunches] = useState<Launch[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshLaunches = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getLaunches();
      setLaunches(data);
    } catch (_error) {
      setError("Failed to fetch launch data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshLaunches();
  }, []);

  const value = {
    launches,
    isLoading,
    error,
    setLaunches,
    refreshLaunches,
  };

  return (
    <LaunchContext.Provider value={value}>{children}</LaunchContext.Provider>
  );
};
