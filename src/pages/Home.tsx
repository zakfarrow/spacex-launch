import LaunchDataTable from "@/components/LaunchDataTable";
import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";

const Home = () => {
  return (
    <Box className="flex justify-center items-center">
      <LaunchDataTable />
      <Outlet />
    </Box>
  );
};

export default Home;
