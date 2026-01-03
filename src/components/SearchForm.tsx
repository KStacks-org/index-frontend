import { useState, FormEvent, useEffect } from "react";
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
import { cn } from "@/lib/utils"; // Import cn utility

interface SearchFormProps {
	initialValues?: Partial<SearchParams>;
	isLoading?: boolean;
	layout?: "hero" | "sidebar";
	onSearch?: (filters: any) => void;
	overlayFilters: boolean;
	dropDown?: boolean;
}

export function SearchForm({
	initialValues,
	isLoading,
	layout = "hero",
	overlayFilters,
	dropDown = false,
	onSearch,
}: SearchFormProps) {
	const navigate = useNavigate();

	// Default open state: Open if sidebar OR if values exist
	const [filtersOpen, setFiltersOpen] = useState(false);

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
	const [genderFilter, setGenderFilter] = useState(initialValues?.gender || "");
	const [branchFilter, setBranchFilter] = useState(initialValues?.branch || "");

	const availableBranches = [
		"المركز الرئيسي",
		"فرع المرجان (ابحر)",
		"فرع رابغ",
	];

	const handleSearch = (e?: FormEvent) => {
		e?.preventDefault();

		const searchParams: Record<string, any> = {
			termCode: termCode,
			q: query || undefined,
			days: dayFilter === "all" ? undefined : dayFilter || undefined,
			level: levelFilter === "all" ? undefined : levelFilter || undefined,
			instructor: instructorFilter || undefined,
			startTime: startTimeFilter || undefined,
			endTime: endTimeFilter || undefined,
			section: sectionFilter || undefined,
			gender: genderFilter === "all" ? undefined : genderFilter || undefined,
			branch: branchFilter === "all" ? undefined : branchFilter || undefined,
			page: 1,
		};

		if (layout === "sidebar" && overlayFilters) {
			setFiltersOpen(false);
		}

		// IF onSearch is provided, use it (Local State)
		if (onSearch) {
			onSearch(searchParams);
		} else {
			// ELSE navigate (Router)
			navigate({
				to: "/search",
				search: searchParams,
			});
		}
	};

	const handleReset = () => {
		setTermCode("202602");
		setDayFilter("");
		setLevelFilter("");
		setInstructorFilter("");
		setStartTimeFilter("");
		setEndTimeFilter("");
		setSectionFilter("");
		setGenderFilter("");
		setBranchFilter("");

		setTimeout(() => {
			handleSearch();
		}, 250);
	};

	useEffect(() => {
		if (layout == "sidebar") {
			const delayDebounceFn = setTimeout(() => {
				handleSearch();
			}, 1000);

			return () => clearTimeout(delayDebounceFn);
		}
	}, [query]);


	const dropDownFocus =
		"rounded-lg focus:bg-white/10 focus:text-white/80 hover:bg-white/10 hover:text-white/80 focus:outline-none";
	const inputBoxTailwind = "h-9 bg-white/5 border border-white/10 rounded-md text-white/90"
	const frostedSelectedContect = "bg-white/10 backdrop-blur-xl backdrop-saturate-150 border border-white/15 rounded-2xl shadow-lg  text-white/80 "

	// --- FILTER FIELDS JSX (Reusable) ---
	const filterFieldsContent = (
		<>
			{/* Term Code */}
			<div className="space-y-1.5">
				<Label className="text-xs font-medium text-muted-foreground">
					Term
				</Label>
				<Select disabled value={termCode} onValueChange={setTermCode}>
					<SelectTrigger className={inputBoxTailwind}>
						<SelectValue placeholder="Select Term" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="202602">2026 Term 2</SelectItem>
					</SelectContent>
				</Select>
			</div>

			{/* Branch */}
			<div className="space-y-1.5">
				<Label className="text-xs font-medium text-muted-foreground">
					Branch
				</Label>
				<Select value={branchFilter} onValueChange={setBranchFilter}>
					<SelectTrigger className={inputBoxTailwind}>
						<SelectValue placeholder="Any" />
					</SelectTrigger>
					<SelectContent className={frostedSelectedContect}>
						<SelectItem className={dropDownFocus} value="all">Any</SelectItem>
						{availableBranches.map((b) => (
							<SelectItem key={b} value={b} className={dropDownFocus}>
								{b}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			{/* Gender */}
			<div className="space-y-1.5">
				<Label className="text-xs font-medium text-muted-foreground">
					Gender
				</Label>
				<Select value={genderFilter} onValueChange={setGenderFilter}>
					<SelectTrigger className={inputBoxTailwind

					}>
						<SelectValue placeholder="Any" />
					</SelectTrigger>
					<SelectContent className={frostedSelectedContect}>
						<SelectItem className={dropDownFocus} value="all">Any</SelectItem>
						<SelectItem className={dropDownFocus} value="male">Male</SelectItem>
						<SelectItem className={dropDownFocus} value="female">Female</SelectItem>
					</SelectContent>
				</Select>
			</div>

			{/* Level */}
			<div className="space-y-1.5 text-white/90">
				<Label className="text-xs font-medium text-muted-foreground">
					Level
				</Label>
				<Select value={levelFilter} onValueChange={setLevelFilter}>
					<SelectTrigger className={inputBoxTailwind

					}>
						<SelectValue placeholder="Any level" />
					</SelectTrigger>
					<SelectContent className={frostedSelectedContect}>
						<SelectItem className={dropDownFocus} value="all">Any level (الكل)</SelectItem>
						<SelectItem className={dropDownFocus} value="دبلوم">Diploma (دبلوم)</SelectItem>
						<SelectItem className={dropDownFocus} value="بكالوريوس">
							Bachelor's (بكالوريوس)
						</SelectItem>
						<SelectItem className={dropDownFocus} value="ماجستير">Master's (ماجستير)</SelectItem>
						<SelectItem className={dropDownFocus} value="دكتوراه">PhD (دكتوراه)</SelectItem>
					</SelectContent>
				</Select>
			</div>

			{/* Day Select */}
			<DayMultiSelect value={dayFilter} onChange={setDayFilter} triggerClassName={inputBoxTailwind}
				contentClassName={frostedSelectedContect} />

			{/* Time Range */}
			<div className="grid grid-cols-2 gap-2">
				<div className="space-y-1.5">
					<Label className="text-xs font-medium text-white/80">
						Start
					</Label>
					<Input
						type="time"
						className={inputBoxTailwind}
						value={startTimeFilter}
						onChange={(e) => setStartTimeFilter(e.target.value)}
					/>
				</div>
				<div className="space-y-1.5">
					<Label className="text-xs font-medium text-white/80">
						End
					</Label>
					<Input
						type="time"
						className={inputBoxTailwind}
						value={endTimeFilter}
						onChange={(e) => setEndTimeFilter(e.target.value)}
					/>
				</div>
			</div>

			{/* Instructor Input */}
			<div className="space-y-1 font-white/90">
				<Label className="text-xs font-medium text-white/80">
					Instructor
				</Label>
				<Input
					className={inputBoxTailwind}
					placeholder="Search instructor..."
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
					className={inputBoxTailwind}
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
			<form
				onSubmit={handleSearch}
				className="flex flex-col gap-4 w-full relative "
			>
				{/* Search Input */}
				<div className="relative z-20">
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4 z-20" />
					<Input
						placeholder="Course, code..."
						className="pl-9 h-10 bg-background 
      focus-visible:border-white/25
	  bg-white/13 backdrop-blur-xl backdrop-saturate-100
            border border-white/15 rounded-2xl shadow-lg w-full text-white/90"
						value={query}
						onChange={(e) => setQuery(e.target.value)}
					/>
				</div>

				{/* Filters Collapse */}
				<Collapsible
					open={!dropDown ? true : filtersOpen}
					onOpenChange={setFiltersOpen}
					className={cn("space-y-2", overlayFilters && "z-30")}
				>
					{dropDown && (
						<CollapsibleTrigger asChild>
							<Button
								variant="outline"
								size="sm"
								type="button"
								className="w-full flex justify-between bg-background hover:bg-muted"
							>
								<span className="flex items-center gap-2">
									<Filter className="h-3 w-3" /> Filters
								</span>
								{filtersOpen ? (
									<ChevronUp className="h-3 w-3" />
								) : (
									<ChevronDown className="h-3 w-3" />
								)}
							</Button>
						</CollapsibleTrigger>
					)}

					<CollapsibleContent
						className={cn(
							// Base styles vvvvvvvvvvvv
							"space-y-4 pt-2 p-3 bg-white/13 backdrop-blur-xl backdrop-saturate-100 border border-white/15 rounded-2xl shadow-lg ",
							// Conditional Overlay styles
							overlayFilters &&
							"absolute top-full left-0 right-0 mt-2 bg-card shadow-xl z-50 animate-in fade-in zoom-in-95 duration-200",
						)}
					>
						{filterFieldsContent}

						<Button type="submit" className={ inputBoxTailwind +" w-full font-medium"}>
							{isLoading ? (
								<Loader2 className="animate-spin h-4 w-4" />
							) : (
								"Apply Filters"
							)}
						</Button>
					</CollapsibleContent>
				</Collapsible>
			</form>
		);
	}

	// --- LAYOUT: HERO MODE (Unchanged logic for main search page) ---
	return (
		<div className="w-full max-w-3xl mx-auto ">
			<form
				onSubmit={handleSearch}
				className="flex gap-2 mb-4 relative rounded-lg"
			>
				<div className="relative flex-1">
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5 z-20" />

					<Input
						placeholder="Search courses, subjects, instructors..."
						className="
      relative z-10
      pl-10 h-12 text-lg
      text-white placeholder:text-white/95
      focus-visible:ring-2 focus-visible:ring-emerald-400/60
      focus-visible:border-white/25
	  bg-white/13 backdrop-blur-xl backdrop-saturate-100
            border border-white/15 rounded-2xl shadow-lg
    "
						value={query}
						onChange={(e) => setQuery(e.target.value)}
					/>

				</div>
				<Button
					type="submit"
					size="lg"
					className="relative h-12 z-10 flex-shrink-0  focus-visible:ring-2 focus-visible:ring-emerald-400/60 px-6 
      focus-visible:border-white/25
	  bg-black/20 backdrop-blur-xl backdrop-saturate-150
            border border-white/15 rounded-2xl shadow-lg hover:bg-white/20"
				>
					{isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : "Search"}
				</Button>
			</form>
			<div className="bg-card border border-border rounded-lg p-1 shadow-sm p-1
	  bg-white/13 backdrop-blur-xl backdrop-saturate-100
            border border-white/15 rounded-2xl shadow-lg">
				<Collapsible open={filtersOpen} onOpenChange={setFiltersOpen}>
					<CollapsibleTrigger asChild>
						<div className="flex items-center justify-between px-3 py-2 cursor-pointer">
							<Button
								variant="ghost"
								size="sm"
								type="button"
								className="flex items-center gap-2 text-white/90"
							>
								<Filter className="h-4 w-4 text-white/90" /> Advanced Filters
								{filtersOpen ? (
									<ChevronUp className="h-3 w-3" />
								) : (
									<ChevronDown className="h-3 w-3" />
								)}
							</Button>
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
/*
function useEffect(arg0: () => (() => void) | undefined, arg1: string[]) {
	throw new Error("Function not implemented.");
}
*/
