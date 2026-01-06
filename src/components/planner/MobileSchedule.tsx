import { useScheduleStore, Course } from "@/lib/schedule-store";
import { DAYS_HEADER, DAY_MAP, parseTimeRange } from "@/lib/schedule-utils";
import { Calendar as CalendarIcon, Clock, MapPin } from "lucide-react";
import { useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Schedule } from "@/lib/api";
import { getCourseHue } from "@/lib/get-course-hue";

export function MobileSchedule() {
	const getActiveCourses = useScheduleStore((state) => state.getActiveCourses);
	const selectedCourses = getActiveCourses();

	if (selectedCourses.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center text-center p-8 min-h-100 border border-dashed rounded-xl bg-muted/10">
				<CalendarIcon className="h-12 w-12 text-muted-foreground/50 mb-4" />
				<p className="font-semibold text-lg text-foreground">
					Your schedule is empty
				</p>
				<p className="text-sm text-muted-foreground mt-2">
					Add courses to see your daily agenda.
				</p>
			</div>
		);
	}

	return (
		<div className="space-y-6 pb-20">
			{DAYS_HEADER.map((day, dayIndex) => {
				// Filter and sort courses for this specific day
				const dayCourses: {
					course: Course;
					schedule: Schedule;
					start: number;
				}[] = [];

				selectedCourses.forEach((course) => {
					course.schedules.forEach((sched) => {
						const time = parseTimeRange(sched.time);
						if (!time) return;

						const courseDays = sched.days.split("");
						const currentDayChar = Object.keys(DAY_MAP).find(
							(key) => DAY_MAP[key] === dayIndex,
						);

						if (currentDayChar && courseDays.includes(currentDayChar)) {
							dayCourses.push({
								course,
								schedule: sched,
								start: time.start,
							});
						}
					});
				});

				// Sort by start time
				dayCourses.sort((a, b) => a.start - b.start);

				if (dayCourses.length === 0) return null;

				return (
					<div key={day} className="flex flex-col gap-3">
						<h3 className="font-bold text-lg text-foreground px-1 sticky top-0 bg-background/95 backdrop-blur z-10 py-2 border-b">
							{day}
						</h3>
						<div className="grid gap-3">
							{dayCourses.map((item, idx) => (
								<MobileCourseCard
									key={`${item.course.id}-${idx}`}
									course={item.course}
									schedule={item.schedule}
								/>
							))}
						</div>
					</div>
				);
			})}
		</div>
	);
}

// Internal component for the list item
function MobileCourseCard({
	course,
	schedule,
}: {
	course: Course;
	schedule: Schedule;
}) {
	const [open, setOpen] = useState(false);
	const hue = getCourseHue(course.subject, course.courseCode);

	return (
		<>
			<div
				onClick={() => setOpen(true)}
				style={{ "--course-hue": hue } as React.CSSProperties}
				className={cn(
					"flex flex-col gap-2 p-4 rounded-lg border cursor-pointer transition-colors active:scale-[0.98]",
					"bg-[hsla(var(--course-hue),85%,60%,0.10)]",
					"border-[hsla(var(--course-hue),70%,45%,0.3)] dark:border-[hsla(var(--course-hue),70%,60%,0.3)]",
				)}
			>
				<div className="flex justify-between items-start">
					<div>
						<h4 className="font-bold text-foreground">
							{course.subject} {course.courseCode}
						</h4>
						<p className="text-xs text-muted-foreground line-clamp-1">
							{course.title}
						</p>
					</div>
					{course.section && (
						<Badge variant="outline" className="bg-background/50">
							{course.section}
						</Badge>
					)}
				</div>

				<div className="flex items-center gap-4 text-sm mt-1">
					<div className="flex items-center gap-1.5 text-foreground/80">
						<Clock className="h-3.5 w-3.5" />
						<span className="font-medium text-xs">{schedule.time}</span>
					</div>
					<div className="flex items-center gap-1.5 text-muted-foreground">
						<MapPin className="h-3.5 w-3.5" />
						<span className="text-xs">{schedule.room || "TBA"}</span>
					</div>
				</div>
			</div>

			{/* Reusing a similar Dialog for details */}
			<Dialog open={open} onOpenChange={setOpen}>
				<DialogContent className="sm:max-w-md w-[90%] rounded-lg">
					<DialogHeader>
						<DialogTitle className="text-xl flex items-center gap-2">
							{course.title}
						</DialogTitle>
						<DialogDescription className="flex items-center gap-2 mt-1">
							<Badge variant="outline">
								{course.subject} {course.courseCode}
							</Badge>
							<Badge variant="secondary">{course.credits} Credits</Badge>
						</DialogDescription>
					</DialogHeader>
					<div className="space-y-4 py-4">
						<div className="grid grid-cols-2 gap-4 text-sm">
							<div>
								<span className="text-muted-foreground block text-xs mb-1">
									Time
								</span>
								<span className="font-medium">{schedule.time}</span>
							</div>
							<div>
								<span className="text-muted-foreground block text-xs mb-1">
									Room
								</span>
								<span className="font-medium">{schedule.room || "TBA"}</span>
							</div>
							<div className="col-span-2">
								<span className="text-muted-foreground block text-xs mb-1">
									Instructor
								</span>
								<span className="font-medium">
									{schedule.instructor || "Staff"}
								</span>
							</div>
						</div>
					</div>
				</DialogContent>
			</Dialog>
		</>
	);
}
