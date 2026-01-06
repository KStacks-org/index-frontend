import { useState } from "react";
import { Course, Schedule } from "@/lib/api";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, User, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

interface ScheduleEventProps {
	course: Course;
	schedule: Schedule;
	style: React.CSSProperties;
	hue: number;
}

export function ScheduleEvent({
	course,
	schedule,
	style,
	hue,
}: ScheduleEventProps) {
	const [open, setOpen] = useState(false);

	return (
		<>
			{/* --- The Event Card on the Calendar --- */}
			<div
				onClick={() => setOpen(true)}
				style={
					{
						...style,
						"--course-hue": hue,
					} as React.CSSProperties
				}
				className={cn(
					"absolute left-[2%] w-[96%] px-1 py-0.5 md:px-1.5 md:py-1 leading-none border shadow-sm z-10 overflow-hidden group flex flex-col justify-start cursor-pointer transition-all duration-200 hover:brightness-95 dark:hover:brightness-110",
					// Dynamic Colors
					"bg-[hsla(var(--course-hue),85%,60%,0.15)]",
					"border-[hsla(var(--course-hue),70%,45%,0.3)] dark:border-[hsla(var(--course-hue),70%,60%,0.3)]",
					"text-[hsl(var(--course-hue),80%,35%)] dark:text-[hsl(var(--course-hue),85%,80%)]",
				)}
				title={`${course.title} \n${schedule.time} \n${schedule.instructor}`}
			>
				<div className="flex w-full justify-between items-center mb-0.5">
					<span className="font-bold text-[8px] md:text-[10px] truncate max-w-full md:max-w-[70%]">
						{course.subject}
						{course.courseCode}
					</span>
					<span className="font-bold text-[10px] inline ml-auto">
						{course.section}
					</span>
				</div>

				<div className="block truncate opacity-90 text-[9px]">
					{schedule.instructor}
				</div>

				<div className="block truncate opacity-75 text-[8px] mt-0.5">
					{schedule.time}
				</div>
			</div>

			{/* --- The Dialog with Details --- */}
			<Dialog open={open} onOpenChange={setOpen}>
				<DialogContent className="sm:max-w-md">
					<DialogHeader>
						<div className="flex items-center justify-between pr-4">
							<DialogTitle className="text-xl flex items-center gap-2">
								{course.title}
							</DialogTitle>
						</div>
						<DialogDescription className="flex items-center gap-2 mt-1">
							<Badge variant="outline" className="font-mono text-xs">
								{course.subject} {course.courseCode}
							</Badge>
							{course.section && (
								<Badge variant="secondary" className="text-xs">
									Section {course.section}
								</Badge>
							)}
							<Badge variant="secondary" className="text-xs">
								{course.credits} Credits
							</Badge>
						</DialogDescription>
					</DialogHeader>

					<div className="grid gap-4 py-4">
						{/* Instructor */}
						<div className="flex items-start gap-3">
							<User className="h-5 w-5 text-muted-foreground mt-0.5" />
							<div className="grid gap-0.5">
								<span className="font-medium text-sm">Instructor</span>
								<span className="text-sm text-muted-foreground">
									{schedule.instructor || "Staff"}
								</span>
							</div>
						</div>

						{/* Time */}
						<div className="flex items-start gap-3">
							<Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
							<div className="grid gap-0.5">
								<span className="font-medium text-sm">Time & Days</span>
								<span className="text-sm text-muted-foreground">
									{schedule.time} ({schedule.days})
								</span>
							</div>
						</div>

						{/* Room/Location */}
						<div className="flex items-start gap-3">
							<MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
							<div className="grid gap-0.5">
								<span className="font-medium text-sm">Location</span>
								<span className="text-sm text-muted-foreground">
									{schedule.room || "TBA"}
								</span>
							</div>
						</div>

						{/* CRN */}
						<div className="flex items-start gap-3">
							<BookOpen className="h-5 w-5 text-muted-foreground mt-0.5" />
							<div className="grid gap-0.5">
								<span className="font-medium text-sm">CRN</span>
								<span className="text-sm text-muted-foreground font-mono">
									{course.crn}
								</span>
							</div>
						</div>
					</div>
				</DialogContent>
			</Dialog>
		</>
	);
}
