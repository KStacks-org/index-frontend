import { useState, useMemo, Fragment } from "react";
import { useScheduleStore } from "@/lib/schedule-store";
import { DAYS_HEADER, DAY_MAP } from "@/lib/schedule-utils";
import {
	Calendar as CalendarIcon,
	Moon,
	Clock,
	MapPin,
	User,
	BookOpen,
	Coffee,
} from "lucide-react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { getCourseHue } from "@/lib/get-course-hue";
import { useRamadanTime } from "@/hooks/use-ramadan-time";
import { Course, Schedule } from "@/types";

// --- PARSER FOR SORTING & BREAK CALCULATION ---
const getStartEndMinutes = (timeString: string) => {
	if (!timeString || !timeString.includes("-"))
		return { startVal: 0, endVal: 0 };

	const [startStr, endStr] = timeString.split("-");

	const parseToMins = (str: string) => {
		const cleanStr = str.trim().toUpperCase();
		const matches = cleanStr.match(/\d+/g);
		if (!matches) return 0;

		let hours = parseInt(matches[0], 10);
		const minutes = parseInt(matches[1], 10);

		if (cleanStr.includes("PM") && hours < 12) hours += 12;
		else if (cleanStr.includes("AM") && hours === 12) hours = 0;

		// Push AM classes (like 1 AM or 2 AM) to the END of the day
		if (hours >= 0 && hours <= 5) hours += 24;

		return hours * 60 + minutes;
	};

	return {
		startVal: parseToMins(startStr),
		endVal: parseToMins(endStr),
	};
};

// Helper to format break duration nicely
const formatBreakTime = (mins: number) => {
	const h = Math.floor(mins / 60);
	const m = mins % 60;
	if (h > 0 && m > 0) return `${h}h ${m}m`;
	if (h > 0) return `${h}h`;
	return `${m}m`;
};

// Helper to format minutes back to standard AM/PM time for the day headers
const formatMinutesToTime = (mins: number) => {
	let h = Math.floor(mins / 60);
	const m = mins % 60;

	if (h >= 24) h -= 24;

	const ampm = h >= 12 ? "PM" : "AM";
	const displayH = h % 12 || 12;
	const displayM = m.toString().padStart(2, "0");

	return `${displayH}:${displayM} ${ampm}`;
};

export function MobileSchedule() {
	const selectedCourses = useScheduleStore((state) => state.getActiveCourses());
	const { isRamadanMode, formatRamadanTime } = useRamadanTime();

	// Lifted state up so we only render one dialog
	const [selectedEvent, setSelectedEvent] = useState<{
		course: Course;
		schedule: Schedule;
	} | null>(null);

	// Group, sort, and calculate timings by day
	const scheduleByDay = useMemo(() => {
		return DAYS_HEADER.map((_day, dayIndex) => {
			const events: {
				course: Course;
				schedule: Schedule;
				startVal: number;
				endVal: number;
			}[] = [];

			selectedCourses.forEach((course) => {
				course.schedules?.forEach((sched) => {
					const displayTimeStr = isRamadanMode
						? formatRamadanTime(sched.time)
						: sched.time;

					const currentDayChar = Object.keys(DAY_MAP).find(
						(key) => DAY_MAP[key] === dayIndex,
					);

					if (currentDayChar && sched.days.includes(currentDayChar)) {
						const { startVal, endVal } = getStartEndMinutes(displayTimeStr);
						events.push({
							course,
							schedule: { ...sched, time: displayTimeStr },
							startVal,
							endVal,
						});
					}
				});
			});

			// Sort chronologically by start time
			return events.sort((a, b) => a.startVal - b.startVal);
		});
	}, [selectedCourses, isRamadanMode, formatRamadanTime]);

	if (selectedCourses.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center text-center p-8 min-h-100 border border-dashed border-border bg-muted/10">
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
		<div className="space-y-8 pb-20">
			{DAYS_HEADER.map((day, dayIndex) => {
				const dayEvents = scheduleByDay[dayIndex];

				if (!dayEvents || dayEvents.length === 0) return null;

				// Calculate Day Range Header
				const startMins = dayEvents[0].startVal;
				const endMins = Math.max(...dayEvents.map((e) => e.endVal));
				const timeRangeStr = `${formatMinutesToTime(startMins)} - ${formatMinutesToTime(endMins)}`;

				return (
					<div
						key={day}
						className="flex flex-col bg-background border border-border shadow-sm"
					>
						{/* Day Header */}
						<div className="sticky top-0 bg-background/95 backdrop-blur z-10 px-4 py-3 border-b border-border flex justify-between items-center">
							<div>
								<h3 className="font-bold text-lg text-foreground uppercase tracking-wider leading-none">
									{day}
								</h3>
								<span className="text-[11px] text-muted-foreground font-medium mt-1 block">
									{timeRangeStr}
								</span>
							</div>
							{isRamadanMode && (
								<Moon className="h-5 w-5 text-amber-500 fill-amber-500/20" />
							)}
						</div>

						{/* Events List */}
						<div className="flex flex-col p-4 gap-3 bg-muted/5">
							{dayEvents.map((event, idx) => {
								const hue = getCourseHue(
									event.course.courseCode,
									event.course.courseNumber,
								);

								// Break Calculation
								let breakElement = null;
								if (idx < dayEvents.length - 1) {
									const nextEvent = dayEvents[idx + 1];
									const gapMins = nextEvent.startVal - event.endVal;

									if (gapMins > 15) {
										breakElement = (
											<div className="flex flex-col items-center justify-center py-3 my-1 border-2 border-dashed border-muted bg-muted/30 text-muted-foreground/70 rounded-none">
												<div className="flex items-center gap-2 mb-1">
													<Coffee className="h-3 w-3" />
													<span className="font-bold tracking-widest text-xs uppercase">
														Break
													</span>
												</div>
												<span className="text-[10px] font-medium opacity-80 bg-background/50 px-2 py-0.5 rounded-none">
													{formatBreakTime(gapMins)}
												</span>
											</div>
										);
									}
								}

								return (
									<Fragment key={`${event.course.crn}-${idx}`}>
										<div
											onClick={() => setSelectedEvent(event)}
											style={{ "--course-hue": hue } as React.CSSProperties}
											className={cn(
												"relative w-full p-4 border shadow-sm cursor-pointer transition-colors active:scale-[0.98] rounded-none",
												"bg-[hsla(var(--course-hue),85%,60%,0.10)]",
												"border-[hsla(var(--course-hue),70%,45%,0.3)] dark:border-[hsla(var(--course-hue),70%,60%,0.3)]",
											)}
										>
											<div className="flex justify-between items-start mb-3">
												<div>
													<h4 className="font-bold text-foreground leading-tight">
														{event.course.courseCode}{" "}
														{event.course.courseNumber}
													</h4>
													<p className="text-xs font-medium text-foreground/70 mt-0.5 line-clamp-1">
														{event.course.title}
													</p>
												</div>
												<span className="font-bold text-[10px] bg-background/50 px-1.5 py-0.5 border border-border/50 text-foreground rounded-none shadow-sm">
													{event.course.section}
												</span>
											</div>

											<div className="flex flex-col gap-2 mt-2">
												<div className="flex items-center gap-2 text-muted-foreground">
													{isRamadanMode ? (
														<Moon className="h-4 w-4 shrink-0" />
													) : (
														<Clock className="h-4 w-4 shrink-0" />
													)}
													<span className="font-medium text-xs">
														{event.schedule.time}
													</span>
												</div>
												<div className="flex items-center justify-between">
													<div className="flex items-center gap-2 text-muted-foreground">
														<MapPin className="h-4 w-4 shrink-0" />
														<span className="text-xs w-fit">
															{event.schedule.room || "TBA"}
														</span>
													</div>
													<div className="flex items-center gap-1.5 text-muted-foreground">
														<User className="h-3 w-3 shrink-0" />
														<span className="text-[10px] w-fit">
															{event.schedule.instructor || "Staff"}
														</span>
													</div>
												</div>
											</div>
										</div>

										{breakElement}
									</Fragment>
								);
							})}
						</div>
					</div>
				);
			})}

			<Dialog
				open={!!selectedEvent}
				onOpenChange={(open) => !open && setSelectedEvent(null)}
			>
				{selectedEvent && (
					<DialogContent className="sm:max-w-md w-[90%] rounded-none">
						<DialogHeader>
							<DialogTitle className="text-xl">
								{selectedEvent.course.title}
							</DialogTitle>
							<DialogDescription className="flex flex-wrap items-center gap-2 mt-2">
								<Badge
									variant="outline"
									className="font-mono text-xs rounded-none"
								>
									{selectedEvent.course.courseCode}{" "}
									{selectedEvent.course.courseNumber}
								</Badge>
								{selectedEvent.course.section && (
									<Badge variant="secondary" className="text-xs rounded-none">
										Section {selectedEvent.course.section}
									</Badge>
								)}
								<Badge variant="secondary" className="text-xs rounded-none">
									{selectedEvent.course.credits} Credits
								</Badge>
							</DialogDescription>
						</DialogHeader>

						<div className="grid gap-4 py-4">
							<div className="flex items-start gap-3">
								<User className="h-5 w-5 text-muted-foreground mt-0.5" />
								<div className="grid gap-0.5">
									<span className="font-medium text-sm">Instructor</span>
									<span className="text-sm text-muted-foreground">
										{selectedEvent.schedule.instructor || "Staff"}
									</span>
								</div>
							</div>

							<div className="flex items-start gap-3">
								{isRamadanMode ? (
									<Moon className="h-5 w-5 text-muted-foreground mt-0.5" />
								) : (
									<Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
								)}{" "}
								<div className="grid gap-0.5">
									<span className="font-medium text-sm">Time & Days</span>
									<span className={cn("text-sm text-muted-foreground")}>
										{selectedEvent.schedule.time} ({selectedEvent.schedule.days}
										)
									</span>
								</div>
							</div>

							<div className="flex items-start gap-3">
								<MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
								<div className="grid gap-0.5">
									<span className="font-medium text-sm">Location</span>
									<span className="text-sm text-muted-foreground">
										{selectedEvent.schedule.room || "TBA"}
									</span>
								</div>
							</div>

							<div className="flex items-start gap-3">
								<BookOpen className="h-5 w-5 text-muted-foreground mt-0.5" />
								<div className="grid gap-0.5">
									<span className="font-medium text-sm">CRN</span>
									<span className="text-sm text-muted-foreground font-mono">
										{selectedEvent.course.crn}
									</span>
								</div>
							</div>
						</div>
					</DialogContent>
				)}
			</Dialog>
		</div>
	);
}
