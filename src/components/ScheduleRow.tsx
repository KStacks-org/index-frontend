import { Schedule } from "@/lib/api";
import { Clock, MapPin, User } from "lucide-react";

export function ScheduleRow({
	schedule,
	section,
}: {
	schedule: Schedule;
	section: string | null;
}) {
	const isDayActive = (dayChar: string) =>
		schedule.days && schedule.days.includes(dayChar);

	return (
		<div className="flex flex-col md:flex-row md:items-center justify-between p-3 rounded-md bg-card border border-border hover:border-primary/50 hover:bg-muted/50 transition-all gap-3 group">
			{/* LEFT: Days & Time */}
			<div className="flex flex-wrap items-center gap-3">
				{/* Days Grid */}
				<div className="flex gap-0.5">
					{["U", "M", "T", "W", "R"].map((d) => (
						<div
							key={d}
							className={`
                                w-6 h-6 flex items-center justify-center rounded text-[10px] font-bold border transition-colors
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

				{/* Time */}
				<div className="flex items-center gap-1.5 text-foreground font-medium text-sm whitespace-nowrap">
					<Clock className="h-3.5 w-3.5 text-primary" />
					<span>{schedule.time || "TBA"}</span>
				</div>
			</div>

			{/* CENTER: Instructor & Location */}
			<div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 md:flex-1 md:px-4">
				{/* Instructor */}
				<div className="flex items-center gap-2 text-muted-foreground min-w-0">
					<User className="h-3.5 w-3.5 shrink-0" />
					<span className="text-sm truncate" title={schedule.instructor}>
						{schedule.instructor || "Staff"}
					</span>
				</div>

				{/* Location (Room) */}
				<div className="flex items-center gap-2 text-muted-foreground min-w-0">
					<MapPin className="h-3.5 w-3.5 shrink-0" />
					<span className="text-sm truncate">{schedule.room || "TBA"}</span>
				</div>
			</div>

			{/* RIGHT: Badges */}
			<div className="flex items-center justify-between md:justify-end gap-2 mt-1 md:mt-0">
				{/* MIGHT ADD LATER */}
				{/*<Badge variant="outline" className="text-xs font-normal">
					{schedule.type}
				</Badge>*/}
				{section && (
					<span className="text-sm font-mono font-bold text-primary bg-primary/10 px-2 py-0.5 rounded border border-primary/20">
						{section}
					</span>
				)}
			</div>
		</div>
	);
}
