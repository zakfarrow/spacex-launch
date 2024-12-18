import { getLaunches } from '@/services/spacex.api';
import { useEffect, useState } from 'react';
import { Launch } from '@/types/launch';
import {
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Typography,
	Box,
	TablePagination,
	TableSortLabel,
} from '@mui/material';

type Order = 'asc' | 'desc';
type OrderBy = 'number' | 'name' | 'date';

const LaunchDataTable = () => {
	const [launchData, setLaunchData] = useState<Launch[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(5);
	const [order, setOrder] = useState<Order>('asc');
	const [orderBy, setOrderBy] = useState<OrderBy>('number');

	useEffect(() => {
		const fetchLaunchData = async () => {
			try {
				const data: Launch[] = await getLaunches();
				setLaunchData(data);
				setIsLoading(false);
			} catch (error) {
				setError('Failed to fetch launch data');
				setIsLoading(false);
			}
		};
		fetchLaunchData();
	}, []);

	const handleRequestSort = (property: OrderBy) => {
		const isAsc = orderBy === property && order === 'asc';
		setOrder(isAsc ? 'desc' : 'asc');
		setOrderBy(property);
	};

	const sortData = (data: Launch[]) => {
		return data.sort((a, b) => {
			if (orderBy === 'name') {
				return order === 'asc'
					? a.name.localeCompare(b.name)
					: b.name.localeCompare(a.name);
			}
			if (orderBy === 'date') {
				return order === 'asc'
					? new Date(a.date_utc).getTime() - new Date(b.date_utc).getTime()
					: new Date(b.date_utc).getTime() - new Date(a.date_utc).getTime();
			}
			return order === 'asc' ? 1 : -1; // For number column
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

	// Sort and slice the data
	const sortedData = sortData([...launchData]);
	const displayedRows = sortedData.slice(
		page * rowsPerPage,
		page * rowsPerPage + rowsPerPage
	);

	return (
		<Box className='bg-slate-50 rounded-md  '>
			<Typography
				variant='h4'
				className='p-6 text-center text-slate-800'>
				SpaceX Launches
			</Typography>

			<Paper className='shadow-lg rounded-md'>
				<TableContainer
					sx={{
						borderRadius: 2,
						height: '800px',
						'& .MuiTable-root': {
							borderCollapse: 'collapse',
							borderSpacing: '0 4px', // Add space between rows
						},
					}}>
					<Table
						stickyHeader
						aria-label='spacex launches table'>
						<TableHead>
							<TableRow sx={{ backgroundColor: '#f5f5f5' }}>
								<TableCell
									sx={{
										// width: '80px',
										fontWeight: 'bold',
										color: '#1a237e',
										padding: '16px',
									}}>
									<TableSortLabel
										active={orderBy === 'number'}
										direction={orderBy === 'number' ? order : 'asc'}
										onClick={() => handleRequestSort('number')}>
										#
									</TableSortLabel>
								</TableCell>
								<TableCell
									sx={{
										fontWeight: 'bold',
										color: '#1a237e',
										padding: '16px',
									}}>
									Rocket ID
								</TableCell>
								<TableCell
									sx={{
										fontWeight: 'bold',
										color: '#1a237e',
										padding: '16px',
									}}>
									<TableSortLabel
										active={orderBy === 'name'}
										direction={orderBy === 'name' ? order : 'asc'}
										onClick={() => handleRequestSort('name')}>
										Name
									</TableSortLabel>
								</TableCell>
								<TableCell
									sx={{
										fontWeight: 'bold',
										color: '#1a237e',
										padding: '16px',
									}}>
									<TableSortLabel
										active={orderBy === 'date'}
										direction={orderBy === 'date' ? order : 'asc'}
										onClick={() => handleRequestSort('date')}>
										Launch Date
									</TableSortLabel>
								</TableCell>
								<TableCell
									sx={{
										fontWeight: 'bold',
										color: '#1a237e',
										padding: '16px',
									}}>
									Details
								</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{displayedRows.map((row, index) => (
								<TableRow
									key={index}
									sx={{
										'&:hover': {
											backgroundColor: '#e2e8f0',
										},
										cursor: 'pointer',
										transition: 'background-color 0.2s ease',
									}}>
									<TableCell
										sx={{
											overflow: 'hidden',
											textOverflow: 'ellipsis',
											whiteSpace: 'nowrap',
											// width: '20px',
											// maxWidth: '20px',
											padding: '16px',
										}}>
										{page * rowsPerPage + index + 1}
									</TableCell>
									<TableCell
										sx={{
											overflow: 'hidden',
											textOverflow: 'ellipsis',
											whiteSpace: 'nowrap',
											// width: '60px',
											// maxWidth: '60px',
											padding: '16px',
										}}>
										{row.rocket_id}
									</TableCell>
									<TableCell
										sx={{
											overflow: 'hidden',
											textOverflow: 'ellipsis',
											whiteSpace: 'nowrap',
											// width: '60px',
											// maxWidth: '60px',
											padding: '16px',
										}}>
										{row.name}
									</TableCell>
									<TableCell
										sx={{
											overflow: 'hidden',
											textOverflow: 'ellipsis',
											whiteSpace: 'nowrap',
											// width: '60px',
											// maxWidth: '60px',
											padding: '16px',
										}}>
										{new Date(row.date_utc).toLocaleDateString('en-US', {
											year: 'numeric',
											month: 'short',
											day: 'numeric',
										})}
									</TableCell>
									<TableCell
										sx={{
											overflow: 'hidden',
											textOverflow: 'ellipsis',
											whiteSpace: 'nowrap',
											// width: '200px',
											// maxWidth: '200px',
											padding: '16px',
										}}>
										{row.details || 'No details available'}
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>
				<TablePagination
					rowsPerPageOptions={[5, 10, 25]}
					component='div'
					count={launchData.length}
					rowsPerPage={rowsPerPage}
					page={page}
					onPageChange={handleChangePage}
					onRowsPerPageChange={handleChangeRowsPerPage}
				/>
			</Paper>
		</Box>
	);
};

export default LaunchDataTable;
