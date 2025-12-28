import axios from "axios";

const BASE_URL = "https://api.kauindex.com";

export interface Schedule {
	type: string;
	days: string;
	time: string;
	room: string;
	instructor: string;
}

export interface Course {
	id: number;
	crn: number;
	section: string;
	subject: string;
	courseCode: string; // The course number (e.g. "202")
	title: string; // The full course name
	primaryInstructor: string;
	credits: number;
	branch: string;
	schedules: Schedule[];

	// Optional fields if your UI relies on them,
	// but these are NOT in the current backend 'mappedData':
	// level?: string;
	// originalTitle?: string;
}

export interface SearchParams {
	termCode?: string;
	page?: number;
	limit?: number;
	q?: string;
	days?: string;
	instructor?: string;
	startTime?: string;
	endTime?: string;
	level?: string;
	crn?: string;
	section?: string;
}

export interface SearchResponse {
	status: string;
	meta: {
		termName: string;
		page: number;
		limit: number;
		total: number;
		totalPages: number;
	};
	data: Course[];
}

export const searchCourses = async (
	params: SearchParams,
): Promise<SearchResponse> => {
	// Clean up params: remove null, empty strings, or 'all' defaults
	const cleanParams = Object.fromEntries(
		Object.entries(params).filter(
			([_, v]) => v != null && v !== "" && v !== "all",
		),
	);

	const { data } = await axios.get<SearchResponse>(`${BASE_URL}/search`, {
		params: cleanParams,
	});
	return data;
};
