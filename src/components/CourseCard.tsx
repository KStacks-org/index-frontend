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
						<div className="hidden sm:flex sm:flex-wrap items-center gap-2 mb-2">
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

							{/* CRN */}
							<Badge variant="outline" className="min-w-14 ml-auto">
								{course.crn || "ERROR GETTING THE CRN"}
							</Badge>
						</div>
						<div className="flex flex-col justify-between items-center gap-2">
							<div className="w-full flex justify-between sm:mb-0 mb-5">
								<div className="flex gap-2 items-center">
									<CardTitle className="text-xl leading-tight font-bold">
										{course.title}
									</CardTitle>
									<Badge
										variant="outline"
										className="block sm:hidden font-mono"
									>
										{course.subject} {course.courseCode}
									</Badge>
								</div>

								{/* CRN */}
								<Badge variant="outline" className="block sm:hidden min-w-14">
									{course.crn || "ERROR GETTING THE CRN"}
								</Badge>

								{/* Section */}
								<div className="hidden sm:flex items-center justify-center md:justify-end">
									{course.section && (
										<Badge variant="secondary" className="min-w-14">
											{course.section}
										</Badge>
									)}
								</div>
							</div>
						</div>
						<div className="flex gap-5 sm:hidden">
							{/* Credits */}
							<Badge variant="secondary">{course.credits} Credits</Badge>

							{/* Section */}
							<div className="flex items-center justify-center md:justify-end">
								{course.section && (
									<Badge variant="secondary" className="min-w-14">
										{course.section}
									</Badge>
								)}
							</div>

							{/* Branch */}
							<span className="text-xs text-muted-foreground uppercase tracking-wider font-bold ml-auto">
								{course.branch}
							</span>
						</div>
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
