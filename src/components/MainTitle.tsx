import { Box, Typography, Container } from "@mui/material";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";

const MainTitle = () => {
  return (
    <Box
      sx={{
        bgcolor: "background.paper",
        py: 4,
        borderRadius: 0,
        m: 0,
      }}
    >
      <Container sx={{ marginX: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 4 }}>
          <RocketLaunchIcon
            sx={{
              width: "50px",
              height: "50px",
              fill: "none",
              stroke: "#f97316",
            }}
          />
          <Typography variant="h4" color="primary">
            SpaceX Launch Data
          </Typography>
          <Typography variant="h5" color="text.secondary">
            View and explore SpaceX launch history
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default MainTitle;
