import { createContext } from "react";
import { LaunchContextType } from "@/types/launch";

const LaunchContext = createContext<LaunchContextType | undefined>(undefined);

export default LaunchContext;
