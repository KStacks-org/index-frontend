import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// Your existing Course interface
export interface Course {
	id: number;
	crn: number;
	title: string;
	courseCode: string;
	subject: string;
	section: string;
	primaryInstructor: string;
	credits: number;
	branch: string;
	schedules: Array<{
		type: string;
		days: string;
		time: string;
		room: string;
		instructor: string;
	}>;
}

// New Interface for a Tab
export interface ScheduleTab {
	id: string;
	name: string;
	courses: Course[];
}

interface ScheduleState {
	tabs: ScheduleTab[];
	activeTabId: string;

	// Tab Actions
	addTab: (name: string) => void;
	removeTab: (tabId: string) => void;
	renameTab: (tabId: string, newName: string) => void;
	setActiveTab: (tabId: string) => void;

	// Course Actions (Apply to the ACTIVE tab)
	addCourse: (course: Course) => void;
	removeCourse: (courseId: number) => void;

	// Selectors
	getActiveCourses: () => Course[];
	isCourseSelected: (courseId: number) => boolean;
}

export const useScheduleStore = create<ScheduleState>()(
	persist(
		(set, get) => ({
			// Initial State (Default tab)
			tabs: [{ id: "default", name: "Schedule 1", courses: [] }],
			activeTabId: "default",

			// --- Tab Management ---
			addTab: (name) => {
				const { tabs } = get();
				// --- LIMIT CHECK: Max 5 tabs ---
				if (tabs.length >= 5) return;

				const newId = crypto.randomUUID();
				set((state) => ({
					tabs: [...state.tabs, { id: newId, name, courses: [] }],
					activeTabId: newId,
				}));
			},

			removeTab: (tabId) => {
				const { tabs, activeTabId } = get();
				if (tabs.length <= 1) return; // Prevent deleting the last tab

				const newTabs = tabs.filter((t) => t.id !== tabId);
				// If closing active tab, switch to the first available
				const newActiveId = activeTabId === tabId ? newTabs[0].id : activeTabId;

				set({ tabs: newTabs, activeTabId: newActiveId });
			},

			renameTab: (tabId, newName) => {
				set((state) => ({
					tabs: state.tabs.map((t) =>
						t.id === tabId ? { ...t, name: newName } : t,
					),
				}));
			},

			setActiveTab: (tabId) => set({ activeTabId: tabId }),

			// --- Course Management (Targets Active Tab) ---
			addCourse: (course) => {
				const { tabs, activeTabId } = get();

				const updatedTabs = tabs.map((tab) => {
					if (tab.id !== activeTabId) return tab;

					// Prevent duplicates in this specific tab
					if (tab.courses.find((c) => c.id === course.id)) return tab;

					// Add course
					return { ...tab, courses: [...tab.courses, { ...course }] };
				});

				set({ tabs: updatedTabs });
			},

			removeCourse: (courseId) => {
				const { tabs, activeTabId } = get();
				const updatedTabs = tabs.map((tab) => {
					if (tab.id !== activeTabId) return tab;
					return {
						...tab,
						courses: tab.courses.filter((c) => c.id !== courseId),
					};
				});
				set({ tabs: updatedTabs });
			},

			// --- Selectors ---
			getActiveCourses: () => {
				const { tabs, activeTabId } = get();
				return tabs.find((t) => t.id === activeTabId)?.courses || [];
			},

			isCourseSelected: (courseId) => {
				const courses = get().getActiveCourses();
				return !!courses.find((c) => c.id === courseId);
			},
		}),
		{
			name: "kau-schedule-storage",
			storage: createJSONStorage(() => localStorage),

			// --- MIGRATION LOGIC ---
			version: 1,
			migrate: (persistedState: any, version) => {
				if (version === 0) {
					const oldCourses = persistedState.selectedCourses || [];
					return {
						tabs: [{ id: "default", name: "Schedule 1", courses: oldCourses }],
						activeTabId: "default",
					};
				}
				return persistedState as ScheduleState;
			},
		},
	),
);
