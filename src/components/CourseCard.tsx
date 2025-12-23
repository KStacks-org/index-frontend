import { Course } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";

import { ScheduleRow } from "./ScheduleRow";

export function CourseCard({ course }: { course: Course }) {
	return (
		<Card className="overflow-hidden border-l-4 border-l-amber-500 hover:shadow-md transition-shadow duration-200">
			<CardHeader className="bg-slate-50/50 pb-3 border-b border-slate-100">
				<div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
					<div>
						<div className="flex flex-wrap items-center gap-2 m-2">
							<Badge
								variant="outline"
								className="bg-white text-slate-700 border-slate-300 font-mono"
							>
								{course.subject} {course.code}
							</Badge>
							<Badge
								variant="secondary"
								className="bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200"
							>
								{course.credits} Credits
							</Badge>
							<span className="text-xs text-slate-400 uppercase tracking-wider font-bold ml-1">
								{course.level}
							</span>
						</div>
						<CardTitle className="text-xl text-slate-900 leading-tight font-bold">
							{course.courseName || course.originalTitle}
						</CardTitle>
					</div>
				</div>
			</CardHeader>
			<CardContent className="pt-4 bg-white">
				<div className="grid gap-3">
					{course.schedules.map((schedule) => (
						<ScheduleRow
							key={schedule.id}
							schedule={schedule}
							section={course.section}
						/>
					))}
				</div>
			</CardContent>
		</Card>
	);
}
