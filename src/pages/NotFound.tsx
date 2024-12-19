import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import { Box, Typography } from "@mui/material";

const NotFound = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        gap: 2,
      }}
    >
      <Typography variant="h2" fontWeight={600} color="text.secondary">
        404 - Page Not Found
      </Typography>
      <Typography variant="subtitle1">
        Sorry, the page you are looking for does not exist.
      </Typography>
      <Button variant="contained" component={Link} to="/">
        Go Home
      </Button>
    </Box>
  );
};

export default NotFound;
