import LaunchDataTable from "@/components/LaunchDataTable";
import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import MainTitle from "@/components/MainTitle";

const Home = () => {
  return (
    <>
      <MainTitle />
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        margin={4}
      >
        <LaunchDataTable />
        <Outlet />
      </Box>
    </>
  );
};

export default Home;
