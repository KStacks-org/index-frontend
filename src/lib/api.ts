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
	branch?: string;
	gender?: string;
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

// Duct-tape: fetch latest course objects by CRN via the existing /search endpoint
export async function getSectionByCrn(crn: string, termCode?: string) {
  const params = new URLSearchParams({ crn });
  if (termCode) params.set("termCode", termCode);

  const res = await fetch(`/section?${params.toString()}`);
  if (!res.ok) throw new Error(`Failed to fetch section ${crn}`);
  return (await res.json()) as { status: string; data: any };
}


