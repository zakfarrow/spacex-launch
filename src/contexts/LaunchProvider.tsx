import { getLaunches } from "@/services/spacex.api";
import { Launch } from "@/types/launch";
import { useState, useEffect } from "react";
import LaunchContext from "@/contexts/LaunchContext";

const LaunchProvider: React.FC<{ children: React.ReactNode }> = ({
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
    } catch (error) {
      setError("Failed to fetch launch data");
      console.error("Error fetching launches:", error);
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

export default LaunchProvider;
