import { useState, useRef } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { toPng } from "html-to-image";
import { Schedule, searchCourses, SearchParams } from "../lib/api";
import { KauHeader } from "@/components/KauHeader";
import { ScheduleCalendar } from "@/components/ScheduleCalendar";
import { CourseCard } from "@/components/CourseCard";
import { SearchForm } from "@/components/SearchForm";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
	Loader2,
	ChevronLeft,
	ChevronRight,
	Plus,
	BookOpen,
	Search as SearchIcon,
	Download,
} from "lucide-react";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";
import { Course, useScheduleStore } from "@/lib/schedule-store";
import { parseTimeRange } from "@/lib/schedule-utils";

export const Route = createFileRoute("/planner")({
	component: SchedulePage,
});

function SchedulePage() {
	const { selectedCourses } = useScheduleStore();

	const calendarRef = useRef<HTMLDivElement>(null);

	// UI State
	const [sidebarMode, setSidebarMode] = useState<"view" | "search">("view");
	const [isSheetOpen, setIsSheetOpen] = useState(false);
	const [isDownloading, setIsDownloading] = useState(false);

	// Search State
	const [localFilters, setLocalFilters] = useState<Partial<SearchParams>>({
		termCode: "202602",
		page: 1,
		limit: 10,
	});

	const { data, isLoading } = useQuery({
		queryKey: ["mini-search", localFilters],
		queryFn: () => searchCourses(localFilters as SearchParams),
		enabled: sidebarMode === "search" && isSheetOpen,
		placeholderData: (prev) => prev,
	});

	const handleLocalSearch = (newFilters: any) => {
		setLocalFilters((prev) => ({ ...prev, ...newFilters, page: 1 }));
	};

	const handlePageChange = (newPage: number) => {
		setLocalFilters((prev) => ({ ...prev, page: newPage }));
	};

	const checkConflict = (courseToCheck: Course): Course[] => {
		// 1. If the exact section is already selected, return empty array (no conflicts to report)
		if (selectedCourses.some((c) => c.id === courseToCheck.id)) return [];

		// 2. Filter to find ALL courses that conflict
		const conflicts = selectedCourses.filter((selected) => {
			// Check A: Is it the same course code? (e.g. Can't add two CPCS 203)
			if (selected.courseCode === courseToCheck.courseCode) {
				return true;
			}

			// Check B: Is there a time conflict?
			return selected.schedules.some((selSched) => {
				return courseToCheck.schedules.some((checkSched: Schedule) => {
					const selDays = selSched.days.split("");
					const checkDays = checkSched.days.split("");

					// If they don't share any days, they don't conflict
					if (!selDays.some((d) => checkDays.includes(d))) return false;

					const selTime = parseTimeRange(selSched.time);
					const checkTime = parseTimeRange(checkSched.time);

					if (!selTime || !checkTime) return false;

					// Check if time ranges overlap
					return selTime.start < checkTime.end && selTime.end > checkTime.start;
				});
			});
		});

		// 3. Return the array of conflicting courses (empty if none)
		return conflicts;
	};

	const openSidebar = (mode: "view" | "search") => {
		setSidebarMode(mode);
		setIsSheetOpen(true);
	};

	// --- UPDATED DOWNLOAD FUNCTION (Captures Full Scroll Size) ---
	const handleDownload = async () => {
		if (!calendarRef.current) return;

		try {
			setIsDownloading(true);
			const element = calendarRef.current;

			// 1. Get the full dimensions of the content (including hidden scroll areas)
			const width = element.scrollWidth;
			const height = element.scrollHeight;

			const dataUrl = await toPng(element, {
				cacheBust: true,
				backgroundColor: "#ffffff",
				pixelRatio: 2, // High resolution
				width: width, // Force full width
				height: height, // Force full height
				style: {
					// Force the node to expand to its full size during capture
					width: `${width}px`,
					height: `${height}px`,
					overflow: "visible",
					maxHeight: "none",
					maxWidth: "none",
				},
			});

			const link = document.createElement("a");
			link.download = "my-schedule.png";
			link.href = dataUrl;
			link.click();
		} catch (error) {
			console.error("Failed to download schedule:", error);
		} finally {
			setIsDownloading(false);
		}
	};

	return (
		<div className="h-screen flex flex-col bg-background font-sans overflow-hidden">
			<KauHeader />

			<div className="hidden flex-1 md:flex overflow-hidden relative">
				<main className="flex-1 p-4 overflow-y-auto bg-muted/10 w-full">
					<div className="max-w-7xl mx-auto h-full flex flex-col">
						<div className="flex justify-between items-center mb-4 px-2">
							<div className="flex items-center gap-5">
								<Button
									variant="outline"
									size="sm"
									className="gap-2"
									onClick={handleDownload}
									disabled={isDownloading || selectedCourses.length === 0}
								>
									{isDownloading ? (
										<Loader2 className="h-4 w-4 animate-spin" />
									) : (
										<Download className="h-4 w-4" />
									)}
								</Button>
								<h1 className="text-2xl font-bold">Planner</h1>
							</div>

							<div className="flex gap-2">
								<Button
									variant="outline"
									size="sm"
									className="gap-2"
									onClick={() => openSidebar("view")}
								>
									<BookOpen className="h-4 w-4" />
									<span className="hidden lg:inline">My Courses</span>
									<Badge
										variant="secondary"
										className="ml-1 h-5 px-1.5 min-w-5"
									>
										{selectedCourses.length}
									</Badge>
								</Button>

								<Button
									size="sm"
									className="gap-2 shadow-sm"
									onClick={() => openSidebar("search")}
								>
									<Plus className="h-4 w-4" />
									<span>Find Courses</span>
								</Button>
							</div>
						</div>

						<div className="flex-1 bg-background rounded-xl border shadow-sm overflow-hidden flex flex-col min-h-0">
							{/* The scroll window is here */}
							<div className="flex-1 overflow-auto">
								{/* The calendar content is here. We ref THIS element to capture everything inside it. */}
								<div className="min-w-200 h-full" ref={calendarRef}>
									<ScheduleCalendar />
								</div>
							</div>
						</div>
					</div>
				</main>

				<Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
					<SheetContent
						side="right"
						className="w-100 sm:w-135 p-0 flex flex-col h-full bg-card"
					>
						<SheetHeader className="p-4 border-b shrink-0">
							<SheetTitle className="flex items-center gap-2 text-lg">
								{sidebarMode === "search" ? (
									<>
										<SearchIcon className="h-5 w-5 text-muted-foreground" />
										Find Courses
									</>
								) : (
									<>
										<BookOpen className="h-5 w-5 text-muted-foreground" />
										My Courses
									</>
								)}
							</SheetTitle>
						</SheetHeader>

						<div className="flex-1 overflow-y-auto bg-muted/5 relative">
							{sidebarMode === "search" && (
								<div className="flex flex-col min-h-full">
									<div className="p-4 border-b bg-background sticky top-0 z-20 shadow-sm">
										<SearchForm
											initialValues={localFilters}
											isLoading={isLoading}
											layout="sidebar"
											overlayFilters={true}
											dropDown={true}
											onSearch={handleLocalSearch}
										/>
									</div>

									<div className="flex-1 p-4 space-y-3">
										{isLoading && (
											<div className="flex justify-center py-10">
												<Loader2 className="h-8 w-8 animate-spin text-primary/50" />
											</div>
										)}

										{!isLoading && data?.data?.length === 0 && (
											<div className="text-center py-20 text-muted-foreground text-sm">
												No courses found matching your filters.
											</div>
										)}

										{data?.data?.map((course) => (
											<CourseCard
												key={course.id}
												course={course}
												compact={true}
												conflict={
													checkConflict(course).length > 0 ? true : false
												}
												conflictCourse={checkConflict(course)}
											/>
										))}
									</div>

									{data && data.meta.totalPages > 1 && (
										<div className="p-3 border-t bg-background flex items-center justify-between text-xs sticky bottom-0 z-20">
											<span className="text-muted-foreground">
												Page {data.meta.page} of {data.meta.totalPages}
											</span>
											<div className="flex gap-2">
												<Button
													variant="outline"
													size="icon"
													className="h-8 w-8"
													disabled={data.meta.page <= 1}
													onClick={() => handlePageChange(data.meta.page - 1)}
												>
													<ChevronLeft className="h-3 w-3" />
												</Button>
												<Button
													variant="outline"
													size="icon"
													className="h-8 w-8"
													disabled={data.meta.page >= data.meta.totalPages}
													onClick={() => handlePageChange(data.meta.page + 1)}
												>
													<ChevronRight className="h-3 w-3" />
												</Button>
											</div>
										</div>
									)}
								</div>
							)}

							{sidebarMode === "view" && (
								<div className="p-4 space-y-3">
									{selectedCourses.length === 0 ? (
										<div className="text-center py-24 flex flex-col items-center text-muted-foreground">
											<div className="bg-muted p-4 rounded-full mb-3 opacity-50">
												<Plus className="h-6 w-6" />
											</div>
											<p className="font-medium">Your schedule is empty</p>
											<Button
												variant="link"
												onClick={() => setSidebarMode("search")}
												className="text-primary mt-1"
											>
												Click to find courses
											</Button>
										</div>
									) : (
										selectedCourses.map((course) => (
											<CourseCard
												key={course.id}
												course={course}
												compact={true}
											/>
										))
									)}
								</div>
							)}
						</div>
					</SheetContent>
				</Sheet>
			</div>

			<div className="flex flex-col justify-center items-center w-full h-full md:hidden px-4 text-center">
				<span className="text-sm opacity-80 bg-destructive/10 text-destructive border border-destructive/20 px-4 py-3 rounded-lg mb-8 max-w-xs">
					Mobile view is currently under development. Please use a desktop
					browser.
				</span>
				<Button variant="secondary" asChild>
					<Link to="/">Return Home</Link>
				</Button>
			</div>
		</div>
	);
}
