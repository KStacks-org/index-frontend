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
	color?: string; // UI property for the calendar
}

interface ScheduleState {
	selectedCourses: Course[];
	addCourse: (course: Course) => void;
	removeCourse: (courseId: number) => void;
	isCourseSelected: (courseId: number) => boolean;
}

const COLORS = [
	"bg-blue-100 border-blue-300 text-blue-800",
	"bg-green-100 border-green-300 text-green-800",
	"bg-purple-100 border-purple-300 text-purple-800",
	"bg-orange-100 border-orange-300 text-orange-800",
	"bg-pink-100 border-pink-300 text-pink-800",
];

export const useScheduleStore = create<ScheduleState>()(
	persist(
		(set, get) => ({
			selectedCourses: [],

			addCourse: (course) => {
				const current = get().selectedCourses;
				// Prevent duplicates
				if (current.find((c) => c.id === course.id)) return;

				// Assign a color cyclically
				const color = COLORS[current.length % COLORS.length];

				// Save the full course object with the new color
				set({ selectedCourses: [...current, { ...course, color }] });
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
