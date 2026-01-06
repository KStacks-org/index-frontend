import { Course } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScheduleRow } from "./ScheduleRow";
import { cn } from "@/lib/utils";

interface SearchCourseCardProps {
	course: Course;
	conflict?: boolean;
	conflictCourse?: Course[];
}

export function SearchCourseCard({ course }: SearchCourseCardProps) {
	return (
		<Card
			className={cn(
				"hover:shadow-md bg-card overflow-hidden transition-all duration-200 group",
			)}
		>
			<CardHeader className="pb-3">
				<div className="flex flex-row items-start justify-between gap-4">
					<div className="flex-1 min-w-0">
						<div className="hidden sm:flex sm:flex-wrap items-center gap-2 mb-2">
							<Badge variant="outline" className="font-mono">
								{course.subject} {course.courseCode}
							</Badge>
							<Badge variant="secondary">{course.credits} Credits</Badge>
							<span className="text-xs text-muted-foreground uppercase tracking-wider font-bold ml-1">
								{course.branch}
							</span>
							<Badge
								variant="outline"
								className="min-w-14 ml-auto hidden md:inline-flex"
							>
								{course.crn || "N/A"}
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
								<Badge variant="outline" className="block md:hidden min-w-14">
									{course.crn || "N/A"}
								</Badge>
								<div className="hidden sm:flex items-center justify-center md:justify-end ml-auto mr-4 md:mr-0">
									{course.section && (
										<Badge variant="secondary" className="min-w-14">
											{course.section}
										</Badge>
									)}
								</div>
							</div>
						</div>

						<div className="flex gap-5 sm:hidden mt-2">
							<Badge variant="secondary">{course.credits} Credits</Badge>
							<div className="flex items-center justify-center md:justify-end">
								{course.section && (
									<Badge variant="secondary" className="min-w-14">
										{course.section}
									</Badge>
								)}
							</div>
							<span className="text-xs text-muted-foreground uppercase tracking-wider font-bold ml-auto">
								{course.branch}
							</span>
						</div>
					</div>
				</div>
			</CardHeader>

			<CardContent className="pt-0">
				{" "}
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
