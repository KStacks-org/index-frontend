import { Course } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { ScheduleRow } from "./ScheduleRow";

export function CourseCard({ course }: { course: Course }) {
	return (
		<Card className="overflow-hidden hover:shadow-md transition-all duration-200">
			<CardHeader className="pb-3 border-b border-border bg-muted/20">
				<div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
					<div className="flex-1">
						<div className="flex flex-wrap items-center gap-2 mb-2">
							{/* Subject & Code */}
							<Badge variant="outline" className="font-mono">
								{course.subject} {course.courseCode}
							</Badge>

							{/* Credits */}
							<Badge variant="secondary">{course.credits} Credits</Badge>

							{/* Branch */}
							<span className="text-xs text-muted-foreground uppercase tracking-wider font-bold ml-1">
								{course.branch}
							</span>

							<Badge variant="secondary" className="ml-auto">
								{course.crn || "ERROR GETTING THE CRN"}
							</Badge>
						</div>
						<CardTitle className="text-xl leading-tight font-bold">
							{course.title}
						</CardTitle>
					</div>
				</div>
			</CardHeader>
			<CardContent className="pt-4">
				<div className="grid gap-3">
					{course.schedules.map((schedule, i) => (
						<ScheduleRow
							key={`${course.id}-${i}`}
							schedule={schedule}
							section={course.section}
						/>
					))}
				</div>
			</CardContent>
		</Card>
	);
}
