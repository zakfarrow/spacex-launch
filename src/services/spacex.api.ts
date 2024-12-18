import axios from 'axios';
import { Launch } from '@/types/launch';

const BASE_URL = 'https://api.spacexdata.com/v4';

export const getLaunches = async (): Promise<Launch[]> => {
	try {
		const response = await axios.get(`${BASE_URL}/launches`);
		return response.data.map((launch: any) => ({
			name: launch.name,
			date_utc: launch.date_utc,
			rocket_id: launch.id,
			launchpad_id: launch.launchpad,
			success: launch.success,
			details: launch.details,
		}));
	} catch (error) {
		console.error('Error fetching launches:', error);
		throw error;
	}
};
