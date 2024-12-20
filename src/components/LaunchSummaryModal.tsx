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
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

const LaunchSummaryModal = () => {
  const { rocketId } = useParams();
  const navigate = useNavigate();
  const { launches } = useLaunchContext();

  const launch = launches.find((l) => l.id === rocketId);

  const handleClose = () => {
    navigate("/");
  };

  if (!launch) return null;

  return (
    <Dialog
      open={true}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: "background.paper",
          padding: 2,
        },
      }}
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" color="primary" fontWeight={600}>
            {launch.name}
          </Typography>
          <IconButton onClick={handleClose} size="small" color="primary">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box>
          <Typography color="text.primary">
            <Typography component="span" fontWeight="bold">
              Launch Date:
            </Typography>{" "}
            {new Date(launch.date_utc).toLocaleDateString("en-UK", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </Typography>
          <Typography color="text.primary">
            <Typography component="span" fontWeight="bold">
              Rocket ID:
            </Typography>{" "}
            {launch.id}
          </Typography>
          <Typography color="text.primary">
            <Typography component="span" fontWeight="bold">
              Launchpad ID:
            </Typography>{" "}
            {launch.launchpad}
          </Typography>
          <Typography color="text.primary">
            <Typography component="span" fontWeight="bold">
              Success:
            </Typography>{" "}
            <Typography
              component="span"
              color={launch.success ? "success" : "error"}
            >
              {launch.success ? (
                <CheckCircleIcon sx={{ width: 18, height: 18 }} />
              ) : (
                <CancelIcon sx={{ width: 18, height: 18 }} />
              )}
            </Typography>
          </Typography>
          <Typography color="text.primary">
            <Typography component="span" fontWeight="bold">
              Details:
            </Typography>{" "}
            <Typography component="span" color="text.secondary">
              {launch.details || "No details available"}
            </Typography>
          </Typography>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default LaunchSummaryModal;
