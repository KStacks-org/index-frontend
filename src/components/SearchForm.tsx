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
import { SearchParams } from "../lib/api"; // Adjust import path

interface SearchFormProps {
	initialValues?: Partial<SearchParams>;
	isLoading?: boolean;
	compact?: boolean; // To style it differently on home vs search page
}

export function SearchForm({
	initialValues,
	isLoading,
	compact,
}: SearchFormProps) {
	const navigate = useNavigate();
	const [filtersOpen, setFiltersOpen] = useState(
		!!(initialValues?.days || initialValues?.level || initialValues?.section),
	);

	// State
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

	const handleSearch = (e?: FormEvent) => {
		e?.preventDefault();

		// Construct search object, removing empty keys to keep URL clean
		const search: Record<string, any> = {
			q: query || undefined,
			days: dayFilter || undefined,
			level: levelFilter || undefined,
			instructor: instructorFilter || undefined,
			startTime: startTimeFilter || undefined,
			endTime: endTimeFilter || undefined,
			section: sectionFilter || undefined,
		};

		// Navigate to the search route with params
		navigate({
			to: "/search",
			search: search,
		});
	};

	return (
		<div className={`w-full ${compact ? "" : "max-w-2xl mx-auto"}`}>
			<form
				onSubmit={handleSearch}
				className="flex gap-2 mb-4 relative shadow-sm rounded-lg"
			>
				<div className="relative flex-1">
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
					<Input
						placeholder="Search courses, subjects, instructors..."
						className="pl-10 h-12 text-lg bg-white border-slate-200 focus-visible:ring-amber-500"
						value={query}
						onChange={(e) => setQuery(e.target.value)}
					/>
				</div>
				<Button
					type="submit"
					size="lg"
					className="h-12 bg-slate-900 hover:bg-slate-800 text-white px-8"
				>
					{isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : "Search"}
				</Button>
			</form>

			<div className="bg-white border rounded-lg p-1 shadow-sm">
				<Collapsible open={filtersOpen} onOpenChange={setFiltersOpen}>
					<div className="flex items-center justify-between px-3 py-2">
						<CollapsibleTrigger asChild>
							<Button
								variant="ghost"
								size="sm"
								className="flex items-center gap-2 text-slate-600"
							>
								<Filter className="h-4 w-4" />
								Filters
								{filtersOpen ? (
									<ChevronUp className="h-3 w-3" />
								) : (
									<ChevronDown className="h-3 w-3" />
								)}
							</Button>
						</CollapsibleTrigger>
						{!filtersOpen && (
							<span className="text-xs text-slate-400 hidden sm:block">
								Refine by Day, Time...
							</span>
						)}
					</div>

					<CollapsibleContent className="px-3 pb-4 pt-1 space-y-4 border-t mt-1">
						<div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
							{/* Day Select */}
							<div className="space-y-1">
								<Label className="text-xs font-medium text-slate-500">
									Day
								</Label>
								<Select value={dayFilter} onValueChange={setDayFilter}>
									<SelectTrigger className="h-9">
										<SelectValue placeholder="Any day" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="all">Any day</SelectItem>
										<SelectItem value="U">Sunday (U)</SelectItem>
										<SelectItem value="M">Monday (M)</SelectItem>
										<SelectItem value="T">Tuesday (T)</SelectItem>
										<SelectItem value="W">Wednesday (W)</SelectItem>
										<SelectItem value="R">Thursday (R)</SelectItem>
									</SelectContent>
								</Select>
							</div>

							{/* Level Select */}
							<div className="space-y-1">
								<Label className="text-xs font-medium text-slate-500">
									Level
								</Label>
								<Select value={levelFilter} onValueChange={setLevelFilter}>
									<SelectTrigger className="h-9">
										<SelectValue placeholder="Any level" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="all">Any level</SelectItem>
										<SelectItem value="Ug">Undergraduate</SelectItem>
										<SelectItem value="Gr">Graduate</SelectItem>
									</SelectContent>
								</Select>
							</div>

							{/* Instructor Input */}
							<div className="space-y-1">
								<Label className="text-xs font-medium text-slate-500">
									Instructor
								</Label>
								<Input
									className="h-9"
									placeholder="Search instructor..."
									value={instructorFilter}
									onChange={(e) => setInstructorFilter(e.target.value)}
								/>
							</div>

							{/* Start Time */}
							<div className="space-y-1">
								<Label className="text-xs font-medium text-slate-500">
									Start Time
								</Label>
								<Input
									type="time"
									className="h-9"
									value={startTimeFilter}
									onChange={(e) => setStartTimeFilter(e.target.value)}
								/>
							</div>

							{/* End Time */}
							<div className="space-y-1">
								<Label className="text-xs font-medium text-slate-500">
									End Time
								</Label>
								<Input
									type="time"
									className="h-9"
									value={endTimeFilter}
									onChange={(e) => setEndTimeFilter(e.target.value)}
								/>
							</div>

							{/* Section */}
							<div className="space-y-1">
								<Label className="text-xs font-medium text-slate-500">
									Section
								</Label>
								<Input
									className="h-9"
									placeholder="e.g., AB"
									value={sectionFilter}
									onChange={(e) => setSectionFilter(e.target.value)}
								/>
							</div>
						</div>
					</CollapsibleContent>
				</Collapsible>
			</div>
		</div>
	);
}
