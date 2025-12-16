import type { Launch } from '~/types/launch'
import { computed, ref, type Ref } from 'vue'

type SortOrder = 'asc' | 'desc'

export const useLaunchFilter = (launches: Ref<Launch[]>) => {
	const selectedYear = ref<string | null>(null)
	const sortOrder = ref<SortOrder>('desc') // default newest first

	const filteredAndSortedLaunches = computed(() => {
		// 1) filter
		const filtered = !selectedYear.value
			? launches.value
			: launches.value.filter((launch) => {
					const year = new Date(launch.launch_date_utc).getFullYear().toString()
					return year === selectedYear.value
				})

		// 2) sort (clone to avoid mutating original)
		return [...filtered].sort((a, b) => {
			const aTime = new Date(a.launch_date_utc).getTime()
			const bTime = new Date(b.launch_date_utc).getTime()
			return sortOrder.value === 'asc' ? aTime - bTime : bTime - aTime
		})
	})

	return {
		selectedYear,
		sortOrder,
		filteredLaunches: filteredAndSortedLaunches, // keep your existing name so page changes are minimal
	}
}
