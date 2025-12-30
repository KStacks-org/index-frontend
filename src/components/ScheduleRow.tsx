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
		<div className="flex flex-col gap-3 p-3 rounded-md bg-card border border-border hover:border-primary/50 hover:bg-muted/50 transition-all group text-center">
			{/* ROW 1 */}
			<div className="flex w-full pb-2 border-b border-border/50">
				{/* 1. Days */}
				<div className="flex gap-0.5">
					{["U", "M", "T", "W", "R", "F", "S"].map((d) => (
						<div
							key={d}
							className={`
                        w-8 h-8 flex items-center justify-center rounded text-xs font-bold border transition-colors
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
			</div>

			{/* ROW 2 */}
			<div className="grid grid-cols-2 md:grid-cols-[0.8fr_1fr_2fr_auto] items-center gap-3 w-full">
				{/* 1. Time */}
				<div className="flex items-center justify-center md:justify-start gap-1.5 text-foreground font-medium text-sm whitespace-nowrap">
					<Clock className="h-3.5 w-3.5 text-primary" />
					<span>{schedule.time || "TBA"}</span>
				</div>

				{/* 2. Instructor */}
				<div className="flex items-center justify-center md:justify-start gap-2 text-muted-foreground min-w-0 px-2">
					<User className="h-3.5 w-3.5 shrink-0" />
					<span className="text-sm truncate" title={schedule.instructor}>
						{schedule.instructor || "Staff"}
					</span>
				</div>

				{/* 3. Location (Now takes the most space) */}
				<div className="flex items-center justify-center md:justify-start gap-2 text-muted-foreground min-w-0 px-2">
					<MapPin className="h-3.5 w-3.5 shrink-0" />
					{/* 'truncate' ensures it respects the new width limit if text is huge */}
					<span
						className="text-sm truncate w-full text-center md:text-left"
						title={schedule.room}
					>
						{schedule.room || "TBA"}
					</span>
				</div>

				{/* 4. Section Badge (Shrinks to fit content) */}
				<div className="flex items-center justify-center md:justify-end">
					{section && (
						<span className="text-sm font-mono font-bold text-primary bg-primary/10 px-2 py-0.5 rounded border border-primary/20 whitespace-nowrap">
							{section}
						</span>
					)}
				</div>
			</div>
		</div>
	);
}
