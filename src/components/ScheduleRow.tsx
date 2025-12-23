import { Schedule } from "@/lib/api";
import { Clock, MapPin, User } from "lucide-react";
import { Badge } from "./ui/badge";

export function ScheduleRow({
	schedule,
	section,
}: {
	schedule: Schedule;
	section: string | null;
}) {
	const isDayActive = (dayChar: string) => schedule.days?.includes(dayChar);

	return (
		<div className="flex flex-col md:flex-row md:items-center justify-between p-3 rounded-md bg-slate-50/50 border border-slate-100 hover:border-amber-300 hover:bg-slate-50 transition-all gap-3">
			{/* LEFT: Days & Time */}
			<div className="flex flex-wrap items-center gap-3">
				{/* Days Grid */}
				<div className="flex gap-0.5">
					{["U", "M", "T", "W", "R"].map((d) => (
						<div
							key={d}
							className={`
                w-6 h-6 flex items-center justify-center rounded text-[10px] font-bold border
                ${
									isDayActive(d)
										? "bg-slate-800 text-white border-slate-800"
										: "bg-white text-slate-300 border-slate-200"
								}
              `}
						>
							{d}
						</div>
					))}
				</div>

				{/* Time */}
				<div className="flex items-center gap-1.5 text-slate-700 font-medium text-sm whitespace-nowrap">
					<Clock className="h-3.5 w-3.5 text-amber-500" />
					<span>
						{schedule.startTime
							? `${schedule.startTime} - ${schedule.endTime}`
							: "TBA"}
					</span>
				</div>
			</div>

			{/* CENTER: Instructor & Location */}
			<div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 md:flex-1 md:px-4">
				{/* Instructor */}
				<div className="flex items-center gap-2 text-slate-600 min-w-0">
					<User className="h-3.5 w-3.5 text-slate-400 shrink-0" />
					<span className="text-sm truncate" title={schedule.instructor}>
						{schedule.instructor || "Staff"}
					</span>
				</div>

				{/* Location */}
				<div className="flex items-center gap-2 text-slate-500 min-w-0">
					<MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
					<span className="text-sm truncate">{schedule.location || "TBA"}</span>
				</div>
			</div>

			{/* RIGHT: Badges */}
			<div className="flex items-center justify-between md:justify-end gap-2 mt-1 md:mt-0">
				<Badge
					variant="outline"
					className="text-xs font-normal text-slate-500 bg-white hover:bg-white"
				>
					{schedule.type}
				</Badge>
				{section && (
					<span className="text-sm font-mono font-bold text-slate-800 bg-slate-200 px-2 py-0.5 rounded border border-slate-300">
						{section}
					</span>
				)}
			</div>
		</div>
	);
}
