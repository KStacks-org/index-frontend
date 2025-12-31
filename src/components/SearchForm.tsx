import { useState, FormEvent } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Search, Loader2, Filter, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { SearchParams } from "../lib/api";
import { DayMultiSelect } from "./DayMultiSelect";

interface SearchFormProps {
	initialValues?: Partial<SearchParams>;
	isLoading?: boolean;
	layout?: "hero" | "sidebar";
}

export function SearchForm({
	initialValues,
	isLoading,
	layout = "hero",
}: SearchFormProps) {
	const navigate = useNavigate();

	const [filtersOpen, setFiltersOpen] = useState(
		layout === "sidebar" ||
			!!(
				initialValues?.days ||
				initialValues?.level ||
				initialValues?.section ||
				initialValues?.instructor ||
				initialValues?.startTime ||
				initialValues?.endTime ||
				initialValues?.gender ||
				initialValues?.branch
			),
	);

	// --- STATE ---
	const [termCode, setTermCode] = useState(initialValues?.termCode || "202602");
	const [query, setQuery] = useState(initialValues?.q || "");
	const [dayFilter, setDayFilter] = useState(initialValues?.days || "");
	const [levelFilter, setLevelFilter] = useState(initialValues?.level || "");
	const [instructorFilter, setInstructorFilter] = useState(
		initialValues?.instructor || "",
	);
	const [startTimeFilter, setStartTimeFilter] = useState(
		initialValues?.startTime || "",
	);
	const [endTimeFilter, setEndTimeFilter] = useState(
		initialValues?.endTime || "",
	);
	const [sectionFilter, setSectionFilter] = useState(
		initialValues?.section || "",
	);

	// New State for Gender & Branch
	const [genderFilter, setGenderFilter] = useState(initialValues?.gender || "");
	const [branchFilter, setBranchFilter] = useState(initialValues?.branch || "");

	const availableBranches = [
		"المركز الرئيسي",
		"فرع المرجان (ابحر)",
		"فرع رابغ",
	];

	const handleSearch = (e?: FormEvent) => {
		e?.preventDefault();

		const search: Record<string, any> = {
			termCode: termCode,
			q: query || undefined,
			days: dayFilter === "all" ? undefined : dayFilter || undefined,
			level: levelFilter === "all" ? undefined : levelFilter || undefined,
			instructor: instructorFilter || undefined,
			startTime: startTimeFilter || undefined,
			endTime: endTimeFilter || undefined,
			section: sectionFilter || undefined,
			// Add new fields to search query
			gender: genderFilter === "all" ? undefined : genderFilter || undefined,
			branch: branchFilter === "all" ? undefined : branchFilter || undefined,
			page: 1,
		};

		navigate({
			to: "/search",
			search: search,
		});
	};

	// --- FILTER FIELDS JSX ---
	const filterFieldsContent = (
		<>
			{/* Term Code */}
			<div className="space-y-1.5">
				<Label className="text-xs font-medium text-muted-foreground">
					Term
				</Label>
				<Select disabled value={termCode} onValueChange={setTermCode}>
					<SelectTrigger className="h-9">
						<SelectValue placeholder="Select Term" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="202602">2026 Term 2</SelectItem>
					</SelectContent>
				</Select>
			</div>

			<div className="space-y-1.5">
				<Label className="text-xs font-medium text-muted-foreground">
					Branch
				</Label>
				<Select value={branchFilter} onValueChange={setBranchFilter}>
					<SelectTrigger className="h-9">
						<SelectValue placeholder="Any" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">Any</SelectItem>
						{availableBranches.map((branch) => (
							<SelectItem key={branch} value={branch}>
								{branch}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			{/* Gender Select */}
			<div className="space-y-1.5">
				<Label className="text-xs font-medium text-muted-foreground">
					Gender
				</Label>
				<Select value={genderFilter} onValueChange={setGenderFilter}>
					<SelectTrigger className="h-9">
						<SelectValue placeholder="Any" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">Any</SelectItem>
						<SelectItem value="male">Male</SelectItem>
						<SelectItem value="female">Female</SelectItem>
					</SelectContent>
				</Select>
			</div>

			{/* Level Select */}
			<div className="space-y-1.5">
				<Label className="text-xs font-medium text-muted-foreground">
					Level
				</Label>
				<Select value={levelFilter} onValueChange={setLevelFilter}>
					<SelectTrigger className="h-9">
						<SelectValue placeholder="Any level" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">Any level</SelectItem>
						<SelectItem value="دبلوم">Diploma</SelectItem>
						<SelectItem value="بكالوريوس">Bachelor's</SelectItem>
						<SelectItem value="ماجستير">Master's</SelectItem>
						<SelectItem value="دكتوراه">PhD</SelectItem>
					</SelectContent>
				</Select>
			</div>

			{/* Day Select */}
			<DayMultiSelect value={dayFilter} onChange={setDayFilter} />

			{/* Time Range */}
			<div className="grid grid-cols-2 gap-2">
				<div className="space-y-1.5">
					<Label className="text-xs font-medium text-muted-foreground">
						Start
					</Label>
					<Input
						type="time"
						className="h-9"
						value={startTimeFilter}
						onChange={(e) => setStartTimeFilter(e.target.value)}
					/>
				</div>
				<div className="space-y-1.5">
					<Label className="text-xs font-medium text-muted-foreground">
						End
					</Label>
					<Input
						type="time"
						className="h-9"
						value={endTimeFilter}
						onChange={(e) => setEndTimeFilter(e.target.value)}
					/>
				</div>
			</div>

			{/* Instructor */}
			<div className="space-y-1.5">
				<Label className="text-xs font-medium text-muted-foreground">
					Instructor
				</Label>
				<Input
					className="h-9"
					placeholder="Search name..."
					value={instructorFilter}
					onChange={(e) => setInstructorFilter(e.target.value)}
				/>
			</div>

			{/* Section */}
			<div className="space-y-1.5">
				<Label className="text-xs font-medium text-muted-foreground">
					Section
				</Label>
				<Input
					className="h-9"
					placeholder="e.g., AB"
					value={sectionFilter}
					onChange={(e) => setSectionFilter(e.target.value)}
				/>
			</div>
		</>
	);

	// --- LAYOUT: SIDEBAR MODE ---
	if (layout === "sidebar") {
		return (
			<form onSubmit={handleSearch} className="flex flex-col gap-6 w-full">
				{/* Search Input */}
				<div className="space-y-2">
					<Label className="text-sm font-semibold">Search</Label>
					<div className="relative">
						<Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
						<Input
							placeholder="Course, code..."
							className="pl-9 h-10"
							value={query}
							onChange={(e) => setQuery(e.target.value)}
						/>
					</div>
				</div>

				{/* Filters Stack */}
				<div className="space-y-4">
					<div className="flex items-center justify-between">
						<Label className="text-sm font-semibold">Filters</Label>
					</div>
					{/* Updated to 2 columns in sidebar for compactness if needed, or keep as col */}
					<div className="flex flex-col gap-4">{filterFieldsContent}</div>
				</div>

				<Button type="submit" className="w-full font-medium">
					{isLoading ? (
						<Loader2 className="animate-spin h-4 w-4" />
					) : (
						"Apply Filters"
					)}
				</Button>
			</form>
		);
	}

	// --- LAYOUT: HERO MODE (Default) ---
	return (
		<div className="w-full max-w-3xl mx-auto">
			{" "}
			<form
				onSubmit={handleSearch}
				className="flex gap-2 mb-4 relative rounded-lg"
			>
				<div className="relative flex-1">
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
					<Input
						placeholder="Search courses, subjects, instructors..."
						className="pl-10 h-12 text-lg"
						value={query}
						onChange={(e) => setQuery(e.target.value)}
					/>
				</div>
				<Button
					type="submit"
					size="lg"
					className="h-12 px-8 font-semibold cursor-pointer"
				>
					{isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : "Search"}
				</Button>
			</form>
			<div className="bg-card border border-border rounded-lg p-1 shadow-sm">
				<Collapsible open={filtersOpen} onOpenChange={setFiltersOpen}>
					<CollapsibleTrigger asChild>
						<div className="flex items-center justify-between px-3 py-2">
							<Button
								variant="ghost"
								size="sm"
								className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
							>
								<Filter className="h-4 w-4" />
								Advanced Filters
								{filtersOpen ? (
									<ChevronUp className="ter" />
								) : (
									<ChevronDown className="h-3 w-3" />
								)}
							</Button>
							{!filtersOpen && (
								<span className="text-xs text-muted-foreground hidden sm:block">
									Refine by Gender, Day, Time...
								</span>
							)}
						</div>
					</CollapsibleTrigger>

					<CollapsibleContent className="px-3 pb-4 pt-1 border-t border-border mt-1">
						<div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
							{filterFieldsContent}
						</div>
					</CollapsibleContent>
				</Collapsible>
			</div>
		</div>
	);
}
