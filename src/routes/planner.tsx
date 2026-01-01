import { useState, useRef } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { toPng } from "html-to-image";
import { searchCourses, SearchParams } from "../lib/api";
import { KauHeader } from "@/components/KauHeader";
import { ScheduleCalendar } from "@/components/ScheduleCalendar";
import { CourseCard } from "@/components/CourseCard";
import { SearchForm } from "@/components/SearchForm";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
	Loader2,
	ChevronLeft,
	ChevronRight,
	Plus,
	BookOpen,
	Search as SearchIcon,
	Download,
	X,
	Edit,
} from "lucide-react";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Course, useScheduleStore } from "@/lib/schedule-store";
import { parseTimeRange } from "@/lib/schedule-utils";
import { KauFooter } from "@/components/KauFooter";

export const Route = createFileRoute("/planner")({
	component: SchedulePage,
});

function SchedulePage() {
	// --- Store Hooks ---
	const {
		tabs,
		activeTabId,
		setActiveTab,
		addTab,
		removeTab,
		renameTab,
		getActiveCourses,
	} = useScheduleStore();

	const selectedCourses = getActiveCourses();
	const calendarRef = useRef<HTMLDivElement>(null);

	// --- UI State ---
	const [sidebarMode, setSidebarMode] = useState<"view" | "search">("view");
	const [isSheetOpen, setIsSheetOpen] = useState(false);
	const [isDownloading, setIsDownloading] = useState(false);

	// --- Dialog State ---
	const [renameDialogOpen, setRenameDialogOpen] = useState(false);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [tabToEdit, setTabToEdit] = useState<{
		id: string;
		name: string;
	} | null>(null);
	const [newName, setNewName] = useState("");

	// --- Search State ---
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

	// --- Handlers ---
	const handleLocalSearch = (newFilters: any) => {
		setLocalFilters((prev) => ({ ...prev, ...newFilters, page: 1 }));
	};

	const handlePageChange = (newPage: number) => {
		setLocalFilters((prev) => ({ ...prev, page: newPage }));
	};

	// Dialog: Open Rename
	const openRenameDialog = (id: string, currentName: string) => {
		setTabToEdit({ id, name: currentName });
		setNewName(currentName);
		setRenameDialogOpen(true);
	};

	// Dialog: Confirm Rename
	const confirmRename = () => {
		if (tabToEdit && newName.trim()) {
			renameTab(tabToEdit.id, newName.trim());
			setRenameDialogOpen(false);
			setTabToEdit(null);
		}
	};

	// Dialog: Open Delete
	const openDeleteDialog = (id: string, name: string) => {
		setTabToEdit({ id, name });
		setDeleteDialogOpen(true);
	};

	// Dialog: Confirm Delete
	const confirmDelete = () => {
		if (tabToEdit) {
			removeTab(tabToEdit.id);
			setDeleteDialogOpen(false);
			setTabToEdit(null);
		}
	};

	const checkConflict = (courseToCheck: Course): Course[] => {
		if (selectedCourses.some((c) => c.id === courseToCheck.id)) return [];

		const conflicts = selectedCourses.filter((selected) => {
			if (selected.courseCode === courseToCheck.courseCode) return true;

			return selected.schedules.some((selSched) => {
				return courseToCheck.schedules.some((checkSched) => {
					const selDays = selSched.days.split("");
					const checkDays = checkSched.days.split("");
					if (!selDays.some((d) => checkDays.includes(d))) return false;

					const selTime = parseTimeRange(selSched.time);
					const checkTime = parseTimeRange(checkSched.time);

					if (!selTime || !checkTime) return false;
					return selTime.start < checkTime.end && selTime.end > checkTime.start;
				});
			});
		});

		return conflicts;
	};

	const openSidebar = (mode: "view" | "search") => {
		setSidebarMode(mode);
		setIsSheetOpen(true);
	};

	const handleDownload = async () => {
		if (!calendarRef.current) return;
		try {
			setIsDownloading(true);
			const element = calendarRef.current;
			const width = element.scrollWidth;
			const height = element.scrollHeight;

			const dataUrl = await toPng(element, {
				cacheBust: true,
				backgroundColor: "#ffffff",
				pixelRatio: 2,
				width: width,
				height: height,
				style: {
					width: `${width}px`,
					height: `${height}px`,
					overflow: "visible",
					maxHeight: "none",
					maxWidth: "none",
				},
			});

			const link = document.createElement("a");
			link.download =
				(tabs.find((t) => t.id === activeTabId)?.name || "schedule") + ".png";
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

						<div className="flex items-center gap-1 mb-0 px-1 overflow-x-auto">
							{tabs.map((tab) => (
								<div
									key={tab.id}
									onClick={() => setActiveTab(tab.id)}
									className={cn(
										"group flex items-center gap-2 px-4 py-2 rounded-t-lg border-t border-x cursor-pointer text-sm font-medium transition-all select-none relative top-px",
										activeTabId === tab.id
											? "bg-background border-border text-foreground z-10"
											: "bg-muted/50 border-transparent text-muted-foreground hover:bg-muted hover:text-foreground",
									)}
								>
									<span>{tab.name}</span>
									<span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">
										{tab.courses.length}
									</span>

									{activeTabId === tab.id && (
										<div className="flex items-center gap-1 ml-2 border-l pl-2 border-border/40">
											<button
												onClick={(e) => {
													e.stopPropagation();
													openRenameDialog(tab.id, tab.name);
												}}
												className="hover:text-primary transition-colors p-0.5 rounded hover:bg-muted"
											>
												<Edit className="h-3 w-3" />
											</button>
											<button
												onClick={(e) => {
													e.stopPropagation();
													openDeleteDialog(tab.id, tab.name);
												}}
												disabled={tabs.length <= 1}
												className="hover:text-destructive transition-colors disabled:opacity-30 p-0.5 rounded hover:bg-destructive/10"
											>
												<X className="h-3 w-3" />
											</button>
										</div>
									)}
								</div>
							))}

							<button
								onClick={() => addTab(`Schedule ${tabs.length + 1}`)}
								disabled={tabs.length >= 5}
								className="ml-1 p-1.5 rounded-full hover:bg-muted text-muted-foreground hover:text-primary transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
								title={
									tabs.length >= 5 ? "Max 5 schedules reached" : "New Schedule"
								}
							>
								<Plus className="h-4 w-4" />
							</button>
						</div>

						<div className="flex-1 bg-background rounded-b-xl rounded-tr-xl border shadow-sm overflow-hidden flex flex-col min-h-0 z-0 relative">
							<div className="flex-1 overflow-auto">
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

			{/* --- RENAME DIALOG --- */}
			<Dialog open={renameDialogOpen} onOpenChange={setRenameDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Rename Schedule</DialogTitle>
						<DialogDescription>
							Give your schedule a new name.
						</DialogDescription>
					</DialogHeader>
					<div className="grid w-full gap-1.5 py-2">
						<Label htmlFor="sched-name">Name</Label>
						<Input
							id="sched-name"
							value={newName}
							onChange={(e) => setNewName(e.target.value)}
							onKeyDown={(e) => e.key === "Enter" && confirmRename()}
							autoFocus
						/>
					</div>
					<DialogFooter>
						<Button
							variant="outline"
							onClick={() => setRenameDialogOpen(false)}
						>
							Cancel
						</Button>
						<Button onClick={confirmRename}>Save Changes</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* --- DELETE DIALOG --- */}
			<Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Delete Schedule</DialogTitle>
						<DialogDescription>
							Are you sure you want to delete{" "}
							<span className="font-medium text-foreground">
								"{tabToEdit?.name}"
							</span>
							? This action cannot be undone.
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button
							variant="outline"
							onClick={() => setDeleteDialogOpen(false)}
						>
							Cancel
						</Button>
						<Button variant="destructive" onClick={confirmDelete}>
							Delete
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
			<KauFooter />
		</div>
	);
}
