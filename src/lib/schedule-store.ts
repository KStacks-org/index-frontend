import { create } from "zustand";
import { persist } from "zustand/middleware";

// Updated interface to match your API and eliminate TS2739
export interface Course {
	id: number;
	crn: number;
	title: string;
	courseCode: string;
	subject: string;
	section: string;
	primaryInstructor: string; // Added
	credits: number; // Added
	branch: string; // Added
	schedules: Array<{
		type: string;
		days: string;
		time: string;
		room: string;
		instructor: string;
	}>;
}

interface ScheduleState {
	selectedCourses: Course[];
	addCourse: (course: Course) => void;
	removeCourse: (courseId: number) => void;
	isCourseSelected: (courseId: number) => boolean;
}

export const useScheduleStore = create<ScheduleState>()(
	persist(
		(set, get) => ({
			selectedCourses: [],

			addCourse: (course) => {
				const current = get().selectedCourses;
				// Prevent duplicates
				if (current.find((c) => c.id === course.id)) return;

				// Assign a color cyclically

				// Save the full course object
				set({ selectedCourses: [...current, { ...course }] });
			},

			removeCourse: (courseId) => {
				set({
					selectedCourses: get().selectedCourses.filter(
						(c) => c.id !== courseId,
					),
				});
			},

			isCourseSelected: (courseId) => {
				return !!get().selectedCourses.find((c) => c.id === courseId);
			},
		}),
		{
			name: "kau-schedule-storage",
		},
	),
);
