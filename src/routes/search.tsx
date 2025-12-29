import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { searchCourses, SearchParams } from "../lib/api";
import { KauHeader } from "@/components/KauHeader";
import { SearchForm } from "@/components/SearchForm";
import { CourseCard } from "@/components/CourseCard";
import { Loader2, FilterX, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CourseSearchSchema {
	q?: string;
	days?: string;
	level?: string;
	instructor?: string;
	startTime?: string;
	endTime?: string;
	section?: string;
	termCode?: string;
	page?: number;
}

export const Route = createFileRoute("/search")({
	validateSearch: (search: Record<string, unknown>): CourseSearchSchema => {
		return {
			q: (search.q as string) || "",
			days: (search.days as string) || "",
			level: (search.level as string) || "",
			instructor: (search.instructor as string) || "",
			startTime: (search.startTime as string) || "",
			endTime: (search.endTime as string) || "",
			section: (search.section as string) || "",
			termCode: (search.termCode as string) || "202602",
			page: Number(search.page) || 1, // Default to page 1
		};
	},
	component: SearchPage,
});

function SearchPage() {
	const searchParams = Route.useSearch();
	const navigate = useNavigate({ from: Route.fullPath });

	const { data, isLoading, isError, error } = useQuery({
		queryKey: ["courses", searchParams],
		queryFn: () => searchCourses(searchParams as SearchParams),
	});

	// Helper to handle page changes
	const handlePageChange = (newPage: number) => {
		navigate({
			search: (prev) => ({ ...prev, page: newPage }),
		});
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	return (
		<div className="min-h-screen bg-background flex flex-col font-sans text-foreground">
			<KauHeader />

			<main className="flex-1 w-full max-w-7xl mx-auto px-4 py-6 md:py-8">
				<div className="flex flex-col lg:flex-row gap-8">
					{/* SIDEBAR */}
					<aside className="w-full lg:w-72 shrink-0">
						<div className="sticky top-24 bg-card p-4 rounded-lg border border-border">
							<SearchForm
								initialValues={searchParams}
								isLoading={isLoading}
								layout="sidebar"
							/>
						</div>
					</aside>

					{/* MAIN CONTENT */}
					<div className="flex-1 min-w-0">
						{/* Status Bar */}
						<div className="mb-6 flex items-center justify-between">
							<h2 className="text-2xl font-bold tracking-tight">
								{data ? (
									<>
										Found{" "}
										<span className="text-green-400">{data.meta.total}</span>{" "}
										courses
									</>
								) : (
									"Searching..."
								)}
							</h2>
						</div>

						{/* Loading State */}
						{isLoading && (
							<div className="w-full text-center py-32 rounded-lg border-2 border-dashed border-border">
								<Loader2 className="animate-spin h-10 w-10 text-green-400 mx-auto" />
								<p className="mt-4 text-muted-foreground">
									Fetching courses...
								</p>
							</div>
						)}

						{/* Error State */}
						{isError && (
							<div className="w-full text-center py-20 text-destructive bg-destructive/10 rounded-lg border border-destructive/20">
								<p className="font-medium">Connection Error</p>
								<p className="text-sm opacity-70 mt-1">
									{(error as Error).message}
								</p>
							</div>
						)}

						{/* Results List */}
						{data && (
							<div className="space-y-4 animate-in slide-in-from-bottom-4 duration-500">
								{data.data.length === 0 ? (
									<div className="text-center py-20 border-2 border-dashed border-border rounded-lg bg-card">
										<div className="bg-muted p-4 rounded-full inline-block mb-4">
											<FilterX className="h-8 w-8 text-muted-foreground" />
										</div>
										<p className="text-muted-foreground text-lg mb-4">
											No courses found matching your criteria.
										</p>
										<Button
											variant="outline"
											onClick={() => navigate({ search: {} })}
										>
											Clear all filters
										</Button>
									</div>
								) : (
									<>
										{data.data.map((course) => (
											<CourseCard key={course.id} course={course} />
										))}

										{/* PAGINATION CONTROLS */}
										<div className="flex items-center justify-between pt-8 border-t border-border mt-8">
											<div className="text-sm text-muted-foreground">
												Page {data.meta.page} of {data.meta.totalPages}
											</div>
											<div className="flex gap-2">
												<Button
													variant="outline"
													size="sm"
													onClick={() => handlePageChange(data.meta.page - 1)}
													disabled={data.meta.page <= 1}
												>
													<ChevronLeft className="h-4 w-4 mr-1" />
													Previous
												</Button>
												<Button
													variant="outline"
													size="sm"
													onClick={() => handlePageChange(data.meta.page + 1)}
													disabled={data.meta.page >= data.meta.totalPages}
												>
													Next
													<ChevronRight className="h-4 w-4 ml-1" />
												</Button>
											</div>
										</div>
									</>
								)}
							</div>
						)}
					</div>
				</div>
			</main>
		</div>
	);
}
