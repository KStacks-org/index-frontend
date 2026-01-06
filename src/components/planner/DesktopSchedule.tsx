import { useMemo } from "react";
import { useScheduleStore } from "@/lib/schedule-store";
import { DAY_MAP, DAYS_HEADER, parseTimeRange } from "@/lib/schedule-utils";
import { cn } from "@/lib/utils";
import { Calendar as CalendarIcon } from "lucide-react";
import { ScheduleEvent } from "./ScheduleEvent";
import { getCourseHue } from "@/lib/get-course-hue";

export function DesktopSchedule() {
	const getActiveCourses = useScheduleStore((state) => state.getActiveCourses);
	const selectedCourses = getActiveCourses();

	// DYNAMIC RANGE CALCULATION
	const { startHour, totalHours } = useMemo(() => {
		if (selectedCourses.length === 0) return { startHour: 8, totalHours: 10 };

		let minMinutes = 24 * 60;
		let maxMinutes = 0;

		selectedCourses.forEach((course) => {
			course.schedules.forEach((sched) => {
				const time = parseTimeRange(sched.time);
				if (time) {
					if (time.start < minMinutes) minMinutes = time.start;
					if (time.end > maxMinutes) maxMinutes = time.end;
				}
			});
		});

		const startH = Math.floor(minMinutes / 60) - 1;
		const endH = Math.ceil(maxMinutes / 60) + 1;
		const safeStart = Math.max(0, startH);
		const safeEnd = Math.min(24, endH);

		return { startHour: safeStart, totalHours: safeEnd - safeStart };
	}, [selectedCourses]);

	const timeSlots = Array.from({ length: totalHours }, (_, i) => i + startHour);

	if (selectedCourses.length === 0) {
		return (
			<div className="h-full w-full rounded-xl border border-dashed border-muted-foreground/25 bg-muted/10 flex flex-col items-center justify-center text-center p-8 min-h-100">
				<div className="bg-background p-4 rounded-full mb-4 shadow-sm border border-border">
					<CalendarIcon className="h-8 w-8 text-muted-foreground/50" />
				</div>
				<p className="font-semibold text-lg text-foreground">
					Your schedule is empty
				</p>
				<p className="text-sm text-muted-foreground mt-1 max-w-xs">
					Search for courses to build your weekly calendar.
				</p>
			</div>
		);
	}

	return (
		<div className="flex flex-col h-full bg-background rounded-xl rounded-tl-none border border-border overflow-hidden w-full shadow-sm relative">
			{/* HEADER ROW (Days) */}
			<div className="flex border-b border-border bg-muted/30 h-8 md:h-10 shrink-0 z-20 relative">
				<div className="w-14 border-r border-border bg-muted/30 shrink-0"></div>
				<div className="flex-1 grid grid-cols-7 divide-x divide-border w-full">
					{DAYS_HEADER.map((day) => (
						<div
							key={day}
							className="flex items-center justify-center font-medium text-sm text-muted-foreground overflow-hidden"
						>
							<span>{day}</span>
						</div>
					))}
				</div>
			</div>

			{/* MAIN CALENDAR BODY */}
			<div className="flex-1 relative w-full h-full min-h-0 bg-background">
				<div className="flex w-full h-full relative">
					{/* TIME SIDEBAR */}
					<div className="w-14 border-r border-border bg-background shrink-0 relative h-full z-10">
						{timeSlots.map((hour, i) => (
							<div
								key={hour}
								className={cn(
									"absolute w-full text-[10px] text-muted-foreground text-right pr-2",
									i === 0 ? "translate-y-0" : "-translate-y-1/2",
								)}
								style={{ top: `${(i / totalHours) * 100}%` }}
							>
								<span className="bg-background px-1">{hour}:00</span>
								<div className="absolute right-0 top-1/2 w-2 border-t border-border"></div>
							</div>
						))}
					</div>

					{/* EVENTS GRID */}
					<div className="flex-1 grid grid-cols-7 divide-x divide-border relative w-full h-full min-w-0">
						{/* Background Lines */}
						<div className="absolute inset-0 z-0 pointer-events-none">
							{timeSlots.map((_h, i) => (
								<div
									key={i}
									className="w-full border-t border-dashed border-border/60"
									style={{
										position: "absolute",
										top: `${(i / totalHours) * 100}%`,
									}}
								></div>
							))}
						</div>

						{/* Course Columns */}
						{DAYS_HEADER.map((day, dayIndex) => (
							<div key={day} className="relative h-full w-full">
								{selectedCourses.map((course) =>
									course.schedules?.map((sched, schedIdx) => {
										const time = parseTimeRange(sched.time);
										if (!time) return null;

										const courseDays = sched.days.split("");
										const currentDayChar = Object.keys(DAY_MAP).find(
											(key) => DAY_MAP[key] === dayIndex,
										);

										if (!currentDayChar || !courseDays.includes(currentDayChar))
											return null;

										const startMinutesFromViewStart =
											time.start - startHour * 60;
										const totalViewMinutes = totalHours * 60;
										const topPercent =
											(startMinutesFromViewStart / totalViewMinutes) * 100;
										const heightPercent =
											((time.end - time.start) / totalViewMinutes) * 100;
										const hue = getCourseHue(course.subject, course.courseCode);

										return (
											<ScheduleEvent
												key={`${course.crn}-${schedIdx}-${day}`}
												course={course}
												schedule={sched}
												hue={hue}
												style={{
													top: `${topPercent}%`,
													height: `${heightPercent}%`,
												}}
											/>
										);
									}),
								)}
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
