// app/types/launch.ts
export type Launch = {
	id: string
	mission_name: string
	launch_date_utc: string
	details?: string | null
	launch_site?: {
		site_name_long?: string | null
	} | null
	rocket?: {
		rocket_name?: string | null
	} | null
}
