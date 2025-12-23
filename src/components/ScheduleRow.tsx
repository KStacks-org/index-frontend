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
	// Helper to check if a day is active
	const isDayActive = (dayChar: string) => schedule.days?.includes(dayChar);

	return (
		<div className="flex flex-col md:flex-row md:items-center justify-between p-3 rounded-md bg-slate-50/50 border border-slate-100 hover:border-amber-300 hover:bg-slate-50 transition-all group">
			{/* Time & Visual Days */}
			<div className="flex items-center gap-4 min-w-60">
				<div className="flex gap-0.5">
					{/* Visual Day Indicators: U M T W R */}
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
				<div className="flex items-center gap-2 text-slate-700 font-medium whitespace-nowrap">
					<Clock className="h-4 w-4 text-amber-500" />
					<span className="text-sm">
						{schedule.startTime
							? `${schedule.startTime} - ${schedule.endTime}`
							: "TBA"}
					</span>
				</div>
			</div>

			{/* Location & Instructor */}
			<div className="flex flex-col sm:flex-row gap-2 sm:gap-6 mt-2 md:mt-0 flex-1 md:px-6">
				<div className="flex items-center gap-2 text-slate-600 min-w-35">
					<User className="h-4 w-4 text-slate-400" />
					<span
						className="text-sm truncate max-w-45"
						title={schedule.instructor}
					>
						{schedule.instructor || "Staff"}
					</span>
				</div>
				<div className="flex items-center gap-2 text-slate-500">
					<MapPin className="h-4 w-4 text-slate-400" />
					<span className="text-sm">{schedule.location || "TBA"}</span>
				</div>
			</div>

			{/* Meta / Type */}
			<div className="flex items-center justify-between md:justify-end gap-3 mt-2 md:mt-0 min-w-30">
				<Badge
					variant="outline"
					className="text-xs font-normal text-slate-500 bg-white"
				>
					{schedule.type}
				</Badge>
				{section && (
					<span className="text-sm font-mono font-bold text-slate-800 bg-slate-200 px-2 py-0.5 rounded">
						{section}
					</span>
				)}
			</div>
		</div>
	);
}
