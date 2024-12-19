import { useNavigate, useParams } from "react-router-dom";
import { useLaunchContext } from "@/hooks/useLaunchContext";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  IconButton,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";

const LaunchSummaryModal = () => {
  const { rocketId } = useParams();
  const navigate = useNavigate();
  const { launches } = useLaunchContext();

  const launch = launches.find((l) => l.rocket_id === rocketId);

  const handleClose = () => {
    navigate("/");
  };

  if (!launch) return null;

  return (
    <Dialog open={true} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">{launch.name}</Typography>
          <IconButton onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box className="space-y-4">
          <Typography>
            <strong>Launch Date:</strong>{" "}
            {new Date(launch.date_utc).toLocaleDateString()}
          </Typography>
          <Typography>
            <strong>Rocket ID:</strong> {launch.rocket_id}
          </Typography>
          <Typography>
            <strong>Launchpad ID:</strong> {launch.launchpad_id}
          </Typography>
          <Typography>
            <strong>Success:</strong> {launch.success ? "Yes" : "No"}
          </Typography>
          <Typography>
            <strong>Details:</strong> {launch.details || "No details available"}
          </Typography>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default LaunchSummaryModal;
