import { useLaunchContext } from "@/hooks/useLaunchContext";
import { Launch } from "@/types/launch";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  TablePagination,
  TableSortLabel,
  CircularProgress,
  IconButton,
  Tooltip,
  Container,
} from "@mui/material";
import { RefreshRounded } from "@mui/icons-material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

type Order = "asc" | "desc";
type OrderBy = "number" | "name" | "date";

const LaunchDataTable = () => {
  const { launches, isLoading, error, refreshLaunches } = useLaunchContext();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [order, setOrder] = useState<Order>("asc");
  const [orderBy, setOrderBy] = useState<OrderBy>("number");
  const navigate = useNavigate();

  const handleRequestSort = (property: OrderBy) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const sortData = (data: Launch[]) => {
    return data.sort((a, b) => {
      if (orderBy === "name") {
        return order === "asc"
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      }
      if (orderBy === "date") {
        return order === "asc"
          ? new Date(a.date_utc).getTime() - new Date(b.date_utc).getTime()
          : new Date(b.date_utc).getTime() - new Date(a.date_utc).getTime();
      }
      return order === "asc" ? 1 : -1;
    });
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const sortedData = sortData([...launches]);
  const displayedRows = sortedData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleRowClick = (rocketId: string) => {
    navigate(`/summary/${rocketId}`);
  };

  const handleRefresh = async () => {
    await refreshLaunches();
    setPage(0);
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "50vh",
        }}
      >
        <CircularProgress color="primary" />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "50vh",
        }}
        color="error.main"
      >
        {error}
      </Box>
    );
  }

  return (
    <Container maxWidth="xl">
      <Box sx={{ bgcolor: "background.default", borderRadius: 2 }}>
        <Paper sx={{ borderRadius: 2, boxShadow: 3, padding: 2 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              marginBottom: 2,
              paddingRight: 2,
            }}
          >
            <Tooltip title="Refresh data">
              <IconButton
                onClick={handleRefresh}
                disabled={isLoading}
                color="primary"
                aria-label="Refresh data"
              >
                <RefreshRounded className={isLoading ? "animate-spin" : ""} />
              </IconButton>
            </Tooltip>
          </Box>
          <TableContainer
            sx={{
              height: "60vh",
              borderRadius: 2,
            }}
          >
            <Table
              stickyHeader
              aria-label="spacex launches table"
              sx={{
                tableLayout: "fixed",
                width: "100%",
                maxHeight: "100vh",
              }}
            >
              <TableHead>
                <TableRow>
                  <TableCell sx={{ width: "5%" }}></TableCell>
                  <TableCell sx={{ width: "15%" }}>Rocket ID</TableCell>
                  <TableCell sx={{ width: "15%" }}>
                    <TableSortLabel
                      active={orderBy === "name"}
                      direction={orderBy === "name" ? order : "asc"}
                      onClick={() => handleRequestSort("name")}
                    >
                      Name
                    </TableSortLabel>
                  </TableCell>
                  <TableCell sx={{ width: "10%" }}>
                    <TableSortLabel
                      active={orderBy === "date"}
                      direction={orderBy === "date" ? order : "asc"}
                      onClick={() => handleRequestSort("date")}
                    >
                      Launch Date
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>Details</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {displayedRows.map((row, index) => (
                  <TableRow key={index} onClick={() => handleRowClick(row.id)}>
                    <TableCell sx={{ color: "secondary.main" }}>
                      {page * rowsPerPage + index + 1}
                    </TableCell>
                    <TableCell>{row.id}</TableCell>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>
                      {new Date(row.date_utc).toLocaleDateString("en-UK", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </TableCell>
                    <TableCell>
                      {row.details || "No details available"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={launches.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            showFirstButton={true}
            showLastButton={true}
            sx={{
              display: "flex",
              justifyContent: "center",
              ".MuiToolbar-root": {
                paddingLeft: 0,
                paddingBottom: 2,
              },
            }}
          />
        </Paper>
      </Box>
    </Container>
  );
};

export default LaunchDataTable;
