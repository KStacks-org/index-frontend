import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { searchCourses, SearchParams } from "../lib/api";
import { KauHeader } from "@/components/KauHeader";
import { SearchForm } from "@/components/SearchForm";
import { CourseCard } from "@/components/CourseCard";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

// 1. Define Valid Search Params
// This ensures strict typing for the URL parameters
interface CourseSearchSchema {
	q?: string;
	days?: string;
	level?: string;
	instructor?: string;
	startTime?: string;
	endTime?: string;
	section?: string;
}

export const Route = createFileRoute("/search")({
	// Parse URL search params
	validateSearch: (search: Record<string, unknown>): CourseSearchSchema => {
		return {
			q: (search.q as string) || "",
			days: (search.days as string) || "",
			level: (search.level as string) || "",
			instructor: (search.instructor as string) || "",
			startTime: (search.startTime as string) || "",
			endTime: (search.endTime as string) || "",
			section: (search.section as string) || "",
		};
	},
	component: SearchPage,
});

function SearchPage() {
	// 2. Get params from URL
	const searchParams = Route.useSearch();

	// 3. Fetch Data based on URL params
	const { data, isLoading, isError, error } = useQuery({
		queryKey: ["courses", searchParams],
		queryFn: () => searchCourses(searchParams as SearchParams),
	});

	return (
		<div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
			<KauHeader />

			<main className="flex-1 flex flex-col items-center px-4 py-8 max-w-5xl mx-auto w-full">
				{/* Compact Form populated with current URL params */}
				<div className="w-full mb-8">
					<SearchForm
						initialValues={searchParams}
						isLoading={isLoading}
						compact
					/>
				</div>

				{/* Loading State */}
				{isLoading && (
					<div className="w-full text-center py-20">
						<Loader2 className="animate-spin h-10 w-10 text-amber-500 mx-auto" />
						<p className="mt-4 text-slate-500">Fetching courses...</p>
					</div>
				)}

				{/* Error State */}
				{isError && (
					<div className="w-full text-center py-20 text-red-500 bg-red-50 rounded-lg border border-red-100">
						<p className="font-medium">Connection Error</p>
						<p className="text-sm opacity-70 mt-1">
							{(error as Error).message}
						</p>
					</div>
				)}

				{/* Results */}
				{data && (
					<div className="w-full space-y-6 animate-in slide-in-from-bottom-4 duration-500">
						<div className="flex justify-between items-baseline mb-2 px-1">
							<h2 className="text-xl font-semibold text-slate-800">
								Found {data.count} results
							</h2>
						</div>

						{data.data.length === 0 ? (
							<div className="text-center py-16 border-2 border-dashed border-slate-200 rounded-lg bg-white">
								<p className="text-slate-500 text-lg">
									No courses found matching your criteria.
								</p>
								{/* Reset button logic handled by navigating to base search or just /search */}
								<Button
									variant="link"
									onClick={() => (window.location.href = "/search")}
								>
									Clear filters
								</Button>
							</div>
						) : (
							data.data.map((course) => (
								<CourseCard key={course.id} course={course} />
							))
						)}
					</div>
				)}
			</main>
		</div>
	);
}
