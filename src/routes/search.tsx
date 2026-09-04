import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { searchCourses } from "../lib/api";
import { KauHeader } from "@/components/layout/KauHeader";
import { Loader2, FilterX, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { KauFooter } from "@/components/layout/KauFooter";
import { SearchForm } from "@/components/search/SearchForm";
import { SearchCourseCard } from "@/components/search/SearchCourseCard";
import { SearchParams } from "@/types";

interface CourseSearchSchema {
  q?: string;
  days?: string;
  level?: string;
  instructor?: string;
  startTime?: string;
  endTime?: string;
  section?: string;
  termCode?: string;
  page?: number;
}

export const Route = createFileRoute("/search")({
  validateSearch: (search: Record<string, unknown>): CourseSearchSchema => {
    return {
      q: (search.q as string) || "",
      days: (search.days as string) || "",
      level: (search.level as string) || "",
      instructor: (search.instructor as string) || "",
      startTime: (search.startTime as string) || "",
      endTime: (search.endTime as string) || "",
      section: (search.section as string) || "",
      termCode: (search.termCode as string) || "202602",
      page: Number(search.page) || 1,
    };
  },

  loaderDeps: ({ search }) => search,

  loader: async ({ deps }) => {
    const data = await searchCourses(deps as SearchParams);
    return { ...data, searchQuery: deps.q };
  },

  head: ({ loaderData }) => {
    const total = loaderData?.meta?.total ?? 0;
    const query = loaderData?.searchQuery;

    const baseUrl = "https://kauindex.com/search";

    const canonicalUrl = query
      ? `${baseUrl}?q=${encodeURIComponent(query)}`
      : baseUrl;

    return {
      links: [{ rel: "canonical", href: canonicalUrl }],
      meta: [
        {
          title: query
            ? `${query} Courses - Schedule`
            : `Search Courses - Browse ${total} Classes`,
        },
        {
          name: "description",
          content: query
            ? `Browse ${total} available courses for ${query}. Find instructors, times, and sections at KAU.`
            : `Search the complete KAU course catalog. Filter by instructor, day, time, and level.`,
        },
        // Open Graph for social sharing
        {
          property: "og:title",
          content: query ? `${query} Courses` : "KAU Course Search",
        },
        { property: "og:description", content: `Found ${total} courses.` },
      ],
      // Structured Data
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SearchResultsPage",
            mainEntity: {
              "@type": "ItemList",
              itemListElement: loaderData?.data.map((course, index) => ({
                "@type": "ListItem",
                position: index + 1,
                item: {
                  "@type": "Course",
                  name: course.title,
                  courseCode: course.courseCode + course.courseNumber,
                  description: `Official course information for ${course.title} (${course.courseCode}${course.courseNumber}) at King Abdulaziz University.`,
                  provider: {
                    "@type": "CollegeOrUniversity",
                    name: "King Abdulaziz University",
                    url: "https://www.kau.edu.sa",
                  },
                },
              })),
            },
          }),
        },
      ],
    };
  },
  component: SearchPage,
});

function SearchPage() {
  const searchParams = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });

  const loaderData = Route.useLoaderData();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["courses", searchParams],
    queryFn: () => searchCourses(searchParams as SearchParams),
    // loaderData contains { data, meta, searchQuery }, which is a valid superset
    // of what searchCourses returns, so this works for hydration
    initialData: loaderData,
  });

  const handlePageChange = (newPage: number) => {
    navigate({
      search: (prev) => ({ ...prev, page: newPage }),
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans text-foreground">
      <KauHeader />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-6 md:py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* SIDEBAR */}
          <aside className="w-full lg:w-72 shrink-0">
            <div className="sticky top-24 bg-card p-4 border border-border">
              <div className="block lg:hidden">
                <SearchForm
                  initialValues={searchParams}
                  isLoading={isLoading}
                  overlayFilters={true}
                  dropDown={true}
                  layout="sidebar"
                />
              </div>

              <div className="hidden lg:block">
                <SearchForm
                  initialValues={searchParams}
                  isLoading={isLoading}
                  overlayFilters={false}
                  dropDown={false}
                  layout="sidebar"
                />
              </div>
            </div>
          </aside>

          {/* MAIN CONTENT */}
          <div className="flex-1 min-w-0">
            {/* Status Bar */}
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold tracking-tight">
                {data ? (
                  <>
                    Found{" "}
                    <span className="text-green-400">{data.meta.total}</span>{" "}
                    courses
                  </>
                ) : (
                  "Searching..."
                )}
              </h2>
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="w-full text-center py-32 border-2 border-dashed border-border">
                <Loader2 className="animate-spin h-10 w-10 text-green-400 mx-auto" />
                <p className="mt-4 text-muted-foreground">
                  Fetching courses...
                </p>
              </div>
            )}

            {/* Error State */}
            {isError && (
              <div className="w-full text-center py-20 text-destructive bg-destructive/10 border border-destructive/20">
                <p className="font-medium">Connection Error</p>
                <p className="text-sm opacity-70 mt-1">
                  {(error as Error).message}
                </p>
              </div>
            )}

            {/* Results List */}
            {data && (
              <div className="space-y-4 animate-in slide-in-from-bottom-4 duration-500">
                {data.data.length === 0 ? (
                  <div className="text-center py-20 border-2 border-dashed border-border bg-card">
                    <div className="bg-muted p-4 inline-block mb-4">
                      <FilterX className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <p className="text-muted-foreground text-lg mb-4">
                      No courses found matching your criteria.
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => navigate({ search: {} })}
                    >
                      Clear all filters
                    </Button>
                  </div>
                ) : (
                  <>
                    {data.data.map((course) => (
                      <SearchCourseCard key={course.id} course={course} />
                    ))}

                    {/* PAGINATION CONTROLS */}
                    <div className="flex items-center justify-between pt-8 border-t border-border mt-8">
                      <div className="text-sm text-muted-foreground">
                        Page {data.meta.page} of {data.meta.totalPages}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePageChange(data.meta.page - 1)}
                          disabled={data.meta.page <= 1}
                        >
                          <ChevronLeft className="h-4 w-4 mr-1" />
                          Previous
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePageChange(data.meta.page + 1)}
                          disabled={data.meta.page >= data.meta.totalPages}
                        >
                          Next
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
      <KauFooter />
    </div>
  );
}
