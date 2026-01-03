import { Schedule } from "@/lib/api";
import { Clock, MapPin, User } from "lucide-react";

export function ScheduleRow({
	schedule,
}: {
	schedule: Schedule;
	section: string | null;
}) {
	const isDayActive = (dayChar: string) =>
		schedule.days && schedule.days.includes(dayChar);

	return (
		<div className="flex flex-col gap-3 p-3 transition-all group text-center bg-white/2 backdrop-blur-3xl backdrop-saturate-100 border border-white/15 rounded-xl shadow-lg  text-white/90 ">
			{/* ROW 1 */}
			<div className="flex w-full pb-2 border-b border-border/50">
				{/* 1. Days */}
				<div className="w-full flex gap-0.5 justify-around sm:justify-start">
					{["U", "M", "T", "W", "R", "F", "S"].map((d) => (
						<div
							key={d}
							className={`
                        w-8 h-8 flex items-center justify-center rounded text-xs font-bold border transition-colors 
                        ${
													isDayActive(d)
														? "bg-green-900 text-primary-foreground border-white/15"
														: "bg-white/70 text-muted-foreground border-border "
												}
                    `}
						>
							{d}
						</div>
					))}
				</div>
				{/* 2. Time LARGE */}
				<div className="hidden sm:flex items-center gap-1.5 text-white/90 font-medium text-sm whitespace-nowrap">
					<Clock className="h-3.5 w-3.5 text-white" />
					<span>{schedule.time || "TBA"}</span>
				</div>
			</div>

			{/* ROW 2 */}
			<div className="flex flex-col md:flex-row justify-around items-start gap-3 md:items-center md:w-full">
				{/* 1. Time SMALL */}
				<div className="sm:hidden flex items-center gap-2 text-white/90 min-w-0 px-2">
					<Clock className="h-3.5 w-3.5 text-white/90" />
					<span>{schedule.time || "TBA"}</span>
				</div>

				{/* 2. Instructor */}
				<div className="flex items-center gap-2 text-white/90 min-w-0 px-2">
					<User className="h-3.5 w-3.5 shrink-0" />
					<span className="text-sm truncate text-white/90" title={schedule.instructor}>
						{schedule.instructor || "Staff"}
					</span>
				</div>

				{/* 3. Location (Now takes the most space) */}
				<div className="flex items-center gap-2 text-white/90 min-w-0 px-2">
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
