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
      <Box className="flex justify-center items-center h-60">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box className="flex justify-center items-center h-60 text-red-600">
        {error}
      </Box>
    );
  }

  return (
    <Box className="bg-slate-50 rounded-md">
      <Paper className="shadow-lg rounded-md p-2">
        <Box className="flex justify-end mb-2 pr-2">
          <Tooltip title="Refresh data">
            <IconButton
              onClick={handleRefresh}
              disabled={isLoading}
              className="text-orange-500 hover:text-orange-700"
            >
              <RefreshRounded className={isLoading ? "animate-spin" : ""} />
            </IconButton>
          </Tooltip>
        </Box>
        <TableContainer
          sx={{
            height: "60vh",
            borderRadius: 2,
            "& .MuiTable-root": {
              borderCollapse: "collapse",
              borderSpacing: "0 4px",
            },
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
                <TableCell
                  sx={{
                    width: "5%",
                    fontWeight: "bold",
                    color: "#f97316",
                    padding: "5px",
                  }}
                ></TableCell>
                <TableCell
                  sx={{
                    width: "15%",
                    fontWeight: "bold",
                    color: "#f97316",
                    padding: "20px",
                  }}
                >
                  Rocket ID
                </TableCell>
                <TableCell
                  sx={{
                    width: "15%",
                    fontWeight: "bold",
                    color: "#f97316",
                    padding: "20px",
                    "&:hover": {
                      color: "#c2410c",
                    },
                    "& .MuiTableSortLabel-root": {
                      color: "#f97316",
                      "&:hover": {
                        color: "#c2410c",
                      },
                      "&.Mui-active": {
                        color: "#c2410c",
                      },
                      "& .MuiTableSortLabel-icon": {
                        color: "#c2410c !important",
                      },
                    },
                    "& .Mui-active": {
                      color: "#c2410c",
                      "& .MuiTableSortLabel-icon": {
                        color: "#c2410c !important",
                      },
                    },
                  }}
                >
                  <TableSortLabel
                    active={orderBy === "name"}
                    direction={orderBy === "name" ? order : "asc"}
                    onClick={() => handleRequestSort("name")}
                  >
                    Name
                  </TableSortLabel>
                </TableCell>
                <TableCell
                  sx={{
                    width: "10%",
                    fontWeight: "bold",
                    color: "#f97316",
                    padding: "20px",
                    "&:hover": {
                      color: "#c2410c",
                    },
                    "& .MuiTableSortLabel-root": {
                      color: "#f97316",
                      "&:hover": {
                        color: "#c2410c",
                      },
                      "&.Mui-active": {
                        color: "#c2410c",
                      },
                      "& .MuiTableSortLabel-icon": {
                        color: "#c2410c !important",
                      },
                    },
                    "& .Mui-active": {
                      color: "#c2410c",
                      "& .MuiTableSortLabel-icon": {
                        color: "#c2410c !important",
                      },
                    },
                  }}
                >
                  <TableSortLabel
                    active={orderBy === "date"}
                    direction={orderBy === "date" ? order : "asc"}
                    onClick={() => handleRequestSort("date")}
                  >
                    Launch Date
                  </TableSortLabel>
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    color: "#f97316",
                    padding: "20px",
                  }}
                >
                  Details
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {displayedRows.map((row, index) => (
                <TableRow
                  key={index}
                  sx={{
                    "&:hover": {
                      backgroundColor: "#f8fafc",
                    },
                    cursor: "pointer",
                    transition: "background-color 0.2s ease",
                  }}
                  onClick={() => handleRowClick(row.rocket_id)}
                >
                  <TableCell
                    sx={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      padding: "20px",
                      color: "#94a3b8",
                    }}
                  >
                    {page * rowsPerPage + index + 1}
                  </TableCell>
                  <TableCell
                    sx={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      padding: "20px",
                    }}
                  >
                    {row.rocket_id}
                  </TableCell>
                  <TableCell
                    sx={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      padding: "20px",
                    }}
                  >
                    {row.name}
                  </TableCell>
                  <TableCell
                    sx={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      padding: "20px",
                    }}
                  >
                    {new Date(row.date_utc).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </TableCell>
                  <TableCell
                    sx={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      padding: "20px",
                    }}
                  >
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
  );
};

export default LaunchDataTable;
