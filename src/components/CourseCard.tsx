import { Course } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Plus, AlertCircle, X } from "lucide-react";
import { ScheduleRow } from "./ScheduleRow";
import { useScheduleStore } from "@/lib/schedule-store";
import { cn } from "@/lib/utils";

interface CourseCardProps {
	course: Course;
	compact?: boolean; // Enables the sidebar layout
	conflict?: boolean; // grays out the card if true
}

export function CourseCard({
	course,
	compact = false,
	conflict = false,
}: CourseCardProps) {
	const { addCourse, removeCourse, isCourseSelected } = useScheduleStore();
	const selected = isCourseSelected(course.id);

	const handleToggle = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		if (selected) {
			removeCourse(course.id);
		} else if (!conflict) {
			addCourse(course);
		}
	};

	// --- COMPACT VIEW (For Sidebar) ---
	if (compact) {
		return (
			<div
				className={cn(
					"relative rounded-lg border bg-card text-card-foreground transition-all duration-200 overflow-hidden",
					selected
						? "border-primary/50 bg-primary/5"
						: "hover:border-primary/50",
					conflict && !selected
						? "opacity-60 bg-muted/30 border-dashed border-destructive/30"
						: "",
				)}
			>
				<div className="p-3 flex items-start gap-3">
					<div className="flex-1 min-w-0">
						{/* Header Row: Code, CRN, Section */}
						<div className="flex flex-wrap items-center gap-2 mb-1.5">
							<Badge
								variant="secondary"
								className="text-[10px] px-1.5 h-5 font-mono bg-muted text-foreground border border-border/50"
							>
								{course.subject}
								{course.courseCode}
							</Badge>

							{course.credits && (
								<Badge className="text-[10px] px-1.5 h-5 font-mono bg-muted text-foreground border border-border/50">
									{course.credits} Credits
								</Badge>
							)}

							{course.section && (
								<span className="text-[10px] font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded-sm">
									{course.section}
								</span>
							)}

							<span className="text-[10px] text-muted-foreground font-mono ml-auto">
								{course.crn}
							</span>
						</div>

						{/* Title */}
						<h4
							className={cn(
								"font-bold text-sm leading-tight mb-2 line-clamp-2",
								conflict && !selected && "text-muted-foreground",
							)}
						>
							{course.title}
						</h4>

						{/* Schedule & Instructor */}
						<div className="space-y-2">
							{course.schedules.map((s, i) => (
								<div
									key={i}
									className="text-[11px] text-muted-foreground flex flex-col gap-0.5 border-l-2 border-muted pl-2"
								>
									<div className="flex items-center gap-2">
										<span className="font-semibold text-foreground w-5">
											{s.days}
										</span>
										<span className="opacity-80">{s.time}</span>
									</div>
									<div
										className="truncate opacity-80 max-w-45"
										title={s.instructor}
									>
										{s.instructor || "Instructor TBA"}
									</div>
								</div>
							))}
						</div>

						{/* Conflict Warning */}
						{conflict && !selected && (
							<div className="mt-2 text-[10px] text-destructive flex items-center gap-1 font-medium bg-destructive/5 p-1 rounded">
								<AlertCircle className="h-3 w-3" /> Time Conflict
							</div>
						)}
					</div>

					{/* Compact Action Button */}
					<Button
						size="icon"
						variant={selected ? "destructive" : "secondary"}
						className={cn(
							"h-7 w-7 shrink-0 mt-0.5",
							conflict && !selected && "cursor-not-allowed opacity-50",
						)}
						onClick={handleToggle}
						disabled={conflict && !selected}
					>
						{selected ? (
							<X className="h-3.5 w-3.5" />
						) : (
							<Plus className="h-3.5 w-3.5" />
						)}
					</Button>
				</div>
			</div>
		);
	}

	// --- STANDARD VIEW (For Search Page) ---
	return (
		<Card
			className={cn(
				"overflow-hidden hover:shadow-md transition-all duration-200",
				selected && "border-primary/50 ring-1 ring-primary/20 bg-primary/5",
			)}
		>
			<CardHeader className="pb-3 border-b border-border bg-muted/20">
				<div className="flex flex-row items-start justify-between gap-4">
					{/* Main Content Area */}
					<div className="flex-1 min-w-0">
						<div className="hidden sm:flex sm:flex-wrap items-center gap-2 mb-2">
							{/* Subject & Code */}
							<Badge variant="outline" className="font-mono">
								{course.subject} {course.courseCode}
							</Badge>

							{/* Credits */}
							<Badge variant="secondary">{course.credits} Credits</Badge>

							{/* Branch */}
							<span className="text-xs text-muted-foreground uppercase tracking-wider font-bold ml-1">
								{course.branch}
							</span>

							{/* CRN */}
							<Badge
								variant="outline"
								className="min-w-14 ml-auto hidden md:inline-flex"
							>
								{course.crn || "N/A"}
							</Badge>
						</div>

						<div className="flex flex-col justify-between items-center gap-2">
							<div className="w-full flex justify-between sm:mb-0 mb-5">
								<div className="flex gap-2 items-center">
									<CardTitle className="text-xl leading-tight font-bold">
										{course.title}
									</CardTitle>
									<Badge
										variant="outline"
										className="block sm:hidden font-mono"
									>
										{course.subject} {course.courseCode}
									</Badge>
								</div>

								{/* Mobile CRN */}
								<Badge variant="outline" className="block md:hidden min-w-14">
									{course.crn || "N/A"}
								</Badge>

								{/* Section */}
								<div className="hidden sm:flex items-center justify-center md:justify-end ml-auto mr-4 md:mr-0">
									{course.section && (
										<Badge variant="secondary" className="min-w-14">
											{course.section}
										</Badge>
									)}
								</div>
							</div>
						</div>

						{/* Mobile Footer Info */}
						<div className="flex gap-5 sm:hidden mt-2">
							<Badge variant="secondary">{course.credits} Credits</Badge>
							<div className="flex items-center justify-center md:justify-end">
								{course.section && (
									<Badge variant="secondary" className="min-w-14">
										{course.section}
									</Badge>
								)}
							</div>
							<span className="text-xs text-muted-foreground uppercase tracking-wider font-bold ml-auto">
								{course.branch}
							</span>
						</div>
					</div>
				</div>
			</CardHeader>
			<CardContent className="pt-4">
				<div className="grid gap-3">
					{course.schedules.map((schedule, i) => (
						<ScheduleRow
							key={`${course.id}-${i}`}
							schedule={schedule}
							section={course.section}
						/>
					))}
				</div>
			</CardContent>
		</Card>
	);
}
