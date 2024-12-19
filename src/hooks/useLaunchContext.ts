import { useContext } from "react";
import LaunchContext from "@/contexts/LaunchContext";
import { LaunchContextType } from "@/types/launch";

export const useLaunchContext = () => {
  const context = useContext<LaunchContextType | undefined>(LaunchContext);
  if (context === undefined) {
    throw new Error("useLaunchContext must be used within a LaunchProvider");
  }
  return context;
};
