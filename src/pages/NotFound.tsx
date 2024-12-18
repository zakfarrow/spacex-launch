import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';

const NotFound = () => {
	return (
		<div>
			<h1>404 - Page Not Found</h1>
			<p>Sorry, the page you are looking for does not exist.</p>
			<Button
				variant='contained'
				component={Link}
				to='/'>
				Go Home
			</Button>
		</div>
	);
};

export default NotFound;
