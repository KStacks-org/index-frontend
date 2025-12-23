import axios from "axios";

const BASE_URL = "https://api-kauindex.tariqjandaly.com/";

export interface Schedule {
	id: number;
	type: string;
	startTime: string | null;
	endTime: string | null;
	days: string;
	location: string;
	instructor: string;
	dateRange: string;
	courseId: number;
}

export interface Course {
	id: number;
	originalTitle: string;
	courseName: string | null;
	crn: string | null;
	subject: string | null;
	code: string | null;
	section: string | null;
	level: string;
	credits: string;
	schedules: Schedule[];
}

export interface SearchParams {
	q?: string;
	days?: string;
	level?: string;
	instructor?: string;
	startTime?: string;
	endTime?: string;
	section?: string;
}

export interface SearchResponse {
	status: string;
	count: number;
	filters: Record<string, any>;
	data: Course[];
}

export const searchCourses = async (
	params: SearchParams,
): Promise<SearchResponse> => {
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
