import { useMemo } from "react";
import { useScheduleStore } from "../lib/schedule-store";
import { DAY_MAP, DAYS_HEADER, parseTimeRange } from "../lib/schedule-utils";

const COLORS = [
	"bg-blue-100 border-blue-300 text-blue-800",
	"bg-green-100 border-green-300 text-green-800",
	"bg-purple-100 border-purple-300 text-purple-800",
	"bg-orange-100 border-orange-300 text-orange-800",
	"bg-pink-100 border-pink-300 text-pink-800",
];

export function ScheduleCalendar() {
	const getActiveCourses = useScheduleStore((state) => state.getActiveCourses);
	const selectedCourses = getActiveCourses();

	// 1. DYNAMIC RANGE CALCULATION (Zoom to fit content)
	const { startHour, totalHours } = useMemo(() => {
		if (selectedCourses.length === 0) {
			return { startHour: 8, totalHours: 10 };
		}

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

		// Add 1 hour buffer before start and after end
		const startH = Math.floor(minMinutes / 60) - 1;
		const endH = Math.ceil(maxMinutes / 60) + 1;

		const safeStart = Math.max(0, startH);
		const safeEnd = Math.min(24, endH);

		return {
			startHour: safeStart,
			totalHours: safeEnd - safeStart,
		};
	}, [selectedCourses]);

	const timeSlots = Array.from({ length: totalHours }, (_, i) => i + startHour);

	if (selectedCourses.length === 0) {
		return (
			<div className="h-full rounded-tl-none bg-muted/10 border-2 border-dashed border-muted rounded-xl flex flex-col items-center justify-center text-center text-muted-foreground p-8 min-h-100">
				<p className="font-medium text-lg">Your schedule is empty.</p>
				<p className="text-sm mt-1">
					Search for courses to build your calendar.
				</p>
			</div>
		);
	}

	return (
		<div className="flex flex-col h-full bg-background rounded-xl border border-t-0 border-l-0 overflow-hidden w-full">
			{/* HEADER ROW (Days) */}
			<div className="flex border-b bg-background h-8 md:h-10 shrink-0 z-20 relative">
				<div className="w-8 md:w-14 border-r bg-background shrink-0 border-b"></div>
				<div className="flex-1 grid grid-cols-7 divide-x bg-background w-full">
					{DAYS_HEADER.map((day) => (
						<div
							key={day}
							className="flex items-center justify-center font-semibold text-[10px] md:text-sm text-muted-foreground bg-background overflow-hidden"
						>
							<span className="hidden md:inline">{day}</span>
							<span className="md:hidden">{day.charAt(0)}</span>
						</div>
					))}
				</div>
			</div>

			{/* MAIN CALENDAR BODY (Fits Vertically) */}
			<div className="flex-1 relative w-full h-full min-h-0">
				<div className="flex w-full h-full relative">
					{/* TIME SIDEBAR */}
					<div className="w-8 md:w-14 border-r bg-background shrink-0 relative h-full">
						{timeSlots.map((hour, i) => (
							<div
								key={hour}
								className="absolute w-full text-[8px] md:text-[10px] text-muted-foreground text-right pr-1 md:pr-2 transform -translate-y-1/2"
								style={{ top: `${(i / totalHours) * 100}%` }}
							>
								<span className="bg-background px-0.5">{hour}:00</span>
								<div className="absolute right-0 top-1/2 w-1.5 md:w-2 border-t border-border"></div>
							</div>
						))}
					</div>

					{/* EVENTS GRID */}
					<div className="flex-1 grid grid-cols-7 divide-x relative w-full h-full min-w-0">
						{/* Background Lines */}
						<div className="absolute inset-0 z-0 pointer-events-none">
							{timeSlots.map((_h, i) => (
								<div
									key={i}
									className="w-full border-t border-dashed border-border/40"
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

										// --- PERCENTAGE CALCULATIONS ---
										const startMinutesFromViewStart =
											time.start - startHour * 60;
										const totalViewMinutes = totalHours * 60;

										const topPercent =
											(startMinutesFromViewStart / totalViewMinutes) * 100;
										const heightPercent =
											((time.end - time.start) / totalViewMinutes) * 100;

										const color =
											COLORS[parseInt(course.courseCode) % COLORS.length];

										return (
											<div
												key={`${course.crn}-${schedIdx}-${day}`}
												className={`absolute left-[2%] w-[96%] rounded-[2px] md:rounded-md px-0.5 md:px-1.5 py-0.5 md:py-1 leading-none border shadow-sm z-10 overflow-hidden group flex flex-col justify-start ${color || "bg-primary/10 border-primary/20 text-primary-foreground"}`}
												style={{
													top: `${topPercent}%`,
													height: `${heightPercent}%`,
													backgroundColor: color
														? undefined
														: "hsl(var(--primary) / 0.1)",
													borderColor: color
														? undefined
														: "hsl(var(--primary) / 0.2)",
													color: color ? undefined : "hsl(var(--foreground))",
												}}
												title={`${course.title} \n${sched.time} \n${sched.instructor}`}
											>
												{/* Course Info */}
												<div className="flex w-full justify-between items-center mb-0.5">
													<span className="font-bold text-[7px] md:text-[10px] truncate max-w-[70%]">
														{course.subject}
														{course.courseCode}
													</span>
													<span className="font-bold text-[7px] md:text-[10px] hidden md:inline ml-auto">
														{course.section}
													</span>
												</div>

												<div className="hidden md:block truncate opacity-90 text-[8px] md:text-[9px]">
													{sched.instructor}
												</div>

												<div className="hidden md:block truncate opacity-75 text-[7px] md:text-[8px] mt-0.5">
													{sched.time}
												</div>
											</div>
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
