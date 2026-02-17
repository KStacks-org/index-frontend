import { useRamadanTime } from "@/hooks/use-ramadan-time";
import { Schedule } from "@/types";
import { Clock, MapPin, Moon, User } from "lucide-react";

export function ScheduleRow({
	schedule,
}: {
	schedule: Schedule;
	section: string | null;
}) {
	const isDayActive = (dayChar: string) =>
		schedule.days && schedule.days.includes(dayChar);

	const { isRamadanMode, formatRamadanTime } = useRamadanTime();

	return (
		<div className="flex flex-col gap-3 p-3 bg-card border border-border transition-all group text-center">
			{/* ROW 1 */}
			<div className="flex w-full pb-2 border-b border-border/50">
				{/* 1. Days */}
				<div className="w-full flex gap-0.5 justify-around sm:justify-start">
					{["U", "M", "T", "W", "R", "F", "S"].map((d) => (
						<div
							key={d}
							className={`
                        w-8 h-8 flex items-center justify-center text-xs font-bold border transition-colors
                        ${
													isDayActive(d)
														? "bg-primary text-primary-foreground border-primary"
														: "bg-muted text-muted-foreground border-border"
												}
                    `}
						>
							{d}
						</div>
					))}
				</div>
				{/* 2. Time LARGE */}
				<div className="hidden sm:flex items-center gap-1.5 text-foreground font-medium text-sm whitespace-nowrap">
					{isRamadanMode ? (
						<Moon className="h-3.5 w-3.5 text-primary" />
					) : (
						<Clock className="h-3.5 w-3.5 text-primary" />
					)}{" "}
					<span>
						{isRamadanMode
							? formatRamadanTime(schedule.time)
							: schedule.time || "TBA"}
					</span>
				</div>
			</div>

			{/* ROW 2 */}
			<div className="flex flex-col md:flex-row justify-around items-start gap-3 md:items-center md:w-full">
				{/* 1. Time SMALL */}
				<div className="sm:hidden flex items-center gap-2 text-foreground min-w-0 px-2">
					<Clock className="h-3.5 w-3.5 text-primary" />
					<span>{schedule.time || "TBA"}</span>
				</div>

				{/* 2. Instructor */}
				<div className="flex items-center gap-2 text-muted-foreground min-w-0 px-2">
					<User className="h-3.5 w-3.5 shrink-0" />
					<span className="text-sm truncate" title={schedule.instructor}>
						{schedule.instructor || "Staff"}
					</span>
				</div>

				{/* 3. Location (Now takes the most space) */}
				<div className="flex items-center gap-2 text-muted-foreground min-w-0 px-2">
					<MapPin className="h-3.5 w-3.5 shrink-0" />
					{/* 'truncate' ensures it respects the new width limit if text is huge */}
					<span
						className="text-sm truncate w-full text-center md:text-left"
						title={schedule.room}
					>
						{schedule.room || "TBA"}
					</span>
				</div>
			</div>
		</div>
	);
}
