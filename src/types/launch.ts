export interface Launch {
	name: string;
	date_utc: string;
	rocket_id: string;
	launchpad_id: string;
	success: boolean;
	details: string | null;
}
