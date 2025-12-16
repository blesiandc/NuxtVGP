<template>
	<v-container>
		<h2 class="mb-4">🚀 SpaceX Launches</h2>

		<!-- Year/Sort Filter -->
		<v-row class="mb-4">
			<v-col cols="12" md="4">
				<v-select
					label="Filter by Launch Year"
					:items="years"
					v-model="selectedYear"
					clearable
					variant="outlined"
					density="comfortable"
				/>
			</v-col>

			<v-col cols="12" md="4">
				<v-select
					label="Sort by Launch Date"
					:items="sortItems"
					item-title="title"
					item-value="value"
					v-model="sortOrder"
					variant="outlined"
					density="comfortable"
				/>
			</v-col>
		</v-row>

		<p>Showing {{ filteredLaunches.length }} launches.</p>

		<v-row>
			<v-col cols="12" md="6" v-for="launch in filteredLaunches" :key="launch.id">
				<v-card class="mb-4">
					<v-card-title class="text-blue">
						{{ launch.mission_name }}
					</v-card-title>

					<v-card-text>
						<p>
							<strong>Launch Date:</strong>
							{{ formatDate(launch.launch_date_utc) }}
						</p>

						<p>
							<strong>Launch Site:</strong>
							{{ launch.launch_site?.site_name_long }}
						</p>

						<p>
							<strong>Rocket:</strong>
							{{ launch.rocket?.rocket_name }}
						</p>

						<p>
							<strong>Details:</strong>
							{{ launch.details || 'No details available.' }}
						</p>
					</v-card-text>
				</v-card>
			</v-col>
		</v-row>
	</v-container>
</template>

<script lang="ts" setup>
import type { Launch } from '~/types/launch'

const query = gql`
	query getLaunches {
		launches {
			id
			mission_name
			launch_date_utc
			launch_site {
				site_name_long
			}
			rocket {
				rocket_name
			}
			details
		}
	}
`

const { data } = useAsyncQuery<{
	launches: Launch[]
}>(query)

const launches = computed<Launch[]>(() => data.value?.launches ?? [])

const sortItems = [
	{ title: 'Newest first (Descending)', value: 'desc' },
	{ title: 'Oldest first (Ascending)', value: 'asc' },
] as const

// ✅ Call composable ONCE, after `launches` exists
const { selectedYear, sortOrder, filteredLaunches } = useLaunchFilter(launches)

const years = computed(() => {
	const set = new Set(
		launches.value.map((launch) => new Date(launch.launch_date_utc).getFullYear().toString()),
	)
	return Array.from(set).sort((a, b) => Number(b) - Number(a))
})

const formatDate = (date: string) => new Date(date).toLocaleDateString()
</script>
