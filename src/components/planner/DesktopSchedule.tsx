import { useState, useMemo, Fragment } from "react";
import { useScheduleStore } from "@/lib/schedule-store";
import { DAY_MAP, DAYS_HEADER } from "@/lib/schedule-utils";
import { cn } from "@/lib/utils";
import {
	Calendar as CalendarIcon,
	Moon,
	Clock,
	MapPin,
	User,
	BookOpen,
	Coffee, // Added Coffee icon for the break!
} from "lucide-react";
import { getCourseHue } from "@/lib/get-course-hue";
import { useRamadanTime } from "@/hooks/use-ramadan-time";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
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

	// Handle midnight wraps (+24 offset) to display properly
	if (h >= 24) h -= 24;

	const ampm = h >= 12 ? "PM" : "AM";
	const displayH = h % 12 || 12;
	const displayM = m.toString().padStart(2, "0");

	return `${displayH}:${displayM} ${ampm}`;
};

export function DesktopSchedule() {
	const selectedCourses = useScheduleStore((state) => state.getActiveCourses());
	const { isRamadanMode, formatRamadanTime } = useRamadanTime();
	const [selectedEvent, setSelectedEvent] = useState<{
		course: Course;
		schedule: Schedule;
	} | null>(null);

	// Group, sort, and calculate timings by day
	const scheduleByDay = useMemo(() => {
		return DAYS_HEADER.slice(0, 5).map((_day, dayIndex) => {
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
			<div className="h-full w-full border border-dashed border-muted-foreground/25 bg-muted/10 flex flex-col items-center justify-center text-center p-8">
				<div className="bg-background p-4 mb-4 shadow-sm border border-border">
					<CalendarIcon className="h-8 w-8 text-muted-foreground/50" />
				</div>
				<p className="font-semibold text-lg text-foreground">
					Your schedule is empty
				</p>
			</div>
		);
	}

	return (
		<>
			<div className="h-full flex flex-col bg-background border border-border w-full shadow-sm overflow-hidden mb-12">
				{/* HEADER ROW */}
				<div className="flex border-b border-border bg-muted/20 shrink-0 z-10 min-h-14">
					<div className="w-12 border-r border-border flex items-center justify-center">
						{isRamadanMode && (
							<Moon className="h-5 w-5 text-amber-500 fill-amber-500/20" />
						)}
					</div>
					<div className="flex-1 grid grid-cols-5 divide-x divide-border">
						{DAYS_HEADER.slice(0, 5).map((day, dayIndex) => {
							const dayEvents = scheduleByDay[dayIndex];

							// Calculate min start and max end for this specific day
							let timeRangeStr = "";
							if (dayEvents && dayEvents.length > 0) {
								const startMins = dayEvents[0].startVal;
								const endMins = Math.max(...dayEvents.map((e) => e.endVal));
								timeRangeStr = `${formatMinutesToTime(startMins)} - ${formatMinutesToTime(endMins)}`;
							}

							return (
								<div
									key={day}
									className="flex flex-col items-center justify-center py-2"
								>
									<span className="font-bold text-sm text-foreground uppercase tracking-wider leading-none">
										{day}
									</span>
									{timeRangeStr && (
										<span className="text-[10px] text-muted-foreground font-medium mt-1">
											{timeRangeStr}
										</span>
									)}
								</div>
							);
						})}
					</div>
				</div>

				{/* SEQUENTIAL COLUMNS BODY */}
				<div className="flex-1 flex bg-muted/5 overflow-auto">
					{/* Left gutter padding */}
					<div className="w-12 border-r border-border shrink-0 bg-background/50"></div>

					<div className="flex-1 grid grid-cols-5 divide-x divide-border">
						{scheduleByDay.map((dayEvents, i) => (
							<div key={i} className="flex flex-col gap-3 p-3 h-full">
								{dayEvents.map((event, idx) => {
									const hue = getCourseHue(
										event.course.courseCode,
										event.course.courseNumber,
									);

									// Calculate Break Block
									let breakElement = null;
									if (idx < dayEvents.length - 1) {
										const nextEvent = dayEvents[idx + 1];
										const gapMins = nextEvent.startVal - event.endVal;

										// If break is > 15 minutes, render the break element
										if (gapMins > 15) {
											breakElement = (
												<div className="flex flex-col items-center justify-center py-4 my-1 border-2 border-dashed border-muted bg-muted/30 text-muted-foreground/70">
													<div className="flex items-center gap-2 mb-1">
														<Coffee className="h-3 w-3" />
														<span className="font-bold tracking-widest text-xs uppercase">
															Break
														</span>
													</div>
													<span className="text-[10px] font-medium opacity-80 bg-background/50 px-2 py-0.5">
														{formatBreakTime(gapMins)}
													</span>
												</div>
											);
										}
									}

									return (
										<Fragment key={`${event.course.crn}-${idx}`}>
											{/* Course Card */}
											<div
												onClick={() => setSelectedEvent(event)}
												style={{ "--course-hue": hue } as React.CSSProperties}
												className={cn(
													"relative w-full p-3 border shadow-sm cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md group",
													"bg-[hsla(var(--course-hue),85%,60%,0.12)] hover:bg-[hsla(var(--course-hue),85%,60%,0.18)]",
													"border-[hsla(var(--course-hue),70%,45%,0.3)] dark:border-[hsla(var(--course-hue),70%,60%,0.3)]",
													"text-[hsl(var(--course-hue),80%,35%)] dark:text-[hsl(var(--course-hue),85%,80%)]",
												)}
											>
												<div className="flex justify-between items-start mb-2 gap-2">
													<span
														title={event.course.title}
														className="font-bold text-xs truncate"
													>
														{event.course.courseCode}{" "}
														{event.course.courseNumber}
													</span>
													<span className="font-bold text-[10px] bg-background/50 px-1.5 py-0.5 shadow-sm">
														{event.course.section}
													</span>
												</div>

												<div className="space-y-1.5">
													<div className="flex items-center gap-1.5 text-[10px] opacity-80 truncate">
														<BookOpen className="h-3 w-3 shrink-0" />
														<span className="truncate">
															{event.course.title}
														</span>
													</div>
													<div className="flex items-center gap-1.5 text-[11px] font-semibold opacity-90">
														{isRamadanMode ? (
															<Moon className="h-3 w-3 shrink-0" />
														) : (
															<Clock className="h-3 w-3 shrink-0" />
														)}
														<span>{event.schedule.time}</span>
													</div>
													<div className="flex items-center gap-1.5 text-[10px] opacity-80 truncate">
														<MapPin className="h-3 w-3 shrink-0" />
														<span className="truncate">
															{event.schedule.room || "TBA"}
														</span>
													</div>
												</div>
											</div>

											{/* Inject the Break Element if applicable */}
											{breakElement}
										</Fragment>
									);
								})}
							</div>
						))}
					</div>
				</div>
			</div>

			{/* DIALOG FOR EVENT DETAILS */}
			<Dialog
				open={!!selectedEvent}
				onOpenChange={(open) => !open && setSelectedEvent(null)}
			>
				{selectedEvent && (
					<DialogContent className="sm:max-w-md rounded-none">
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
								{isRamadanMode && (
									<Badge className="bg-amber-100 text-amber-900 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 gap-1 text-xs rounded-none">
										<Moon className="h-3 w-3" /> Ramadan Timing
									</Badge>
								)}
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
								<Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
								<div className="grid gap-0.5">
									<span className="font-medium text-sm">Time & Days</span>
									<span
										className={cn(
											"text-sm",
											isRamadanMode
												? "text-amber-600 dark:text-amber-400 font-medium"
												: "text-muted-foreground",
										)}
									>
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
		</>
	);
}
