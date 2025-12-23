import { createFileRoute } from "@tanstack/react-router";
import { KauHeader } from "@/components/KauHeader";
import { SearchForm } from "@/components/SearchForm";
import { Search } from "lucide-react";

export const Route = createFileRoute("/")({
	component: KauIndexHome,
});

function KauIndexHome() {
	return (
		<div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
			<KauHeader />

			<main className="flex-1 flex flex-col items-center px-4 py-8 max-w-5xl mx-auto w-full">
				{/* Spacer to push content down */}
				<div className="mt-[15vh] mb-12 text-center w-full transition-all duration-500">
					<div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
						<h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">
							Find Your <span className="text-amber-500">Courses</span>
						</h1>
						<p className="text-slate-500 mb-8 max-w-lg mx-auto text-lg">
							Search and discover courses at King Abdulaziz University with
							ease.
						</p>
					</div>

					{/* The Form handles navigation to /search automatically */}
					<SearchForm />
				</div>

				{/* Decorative Icon */}
				<div className="flex flex-col items-center mt-8 opacity-50 animate-in fade-in duration-1000">
					<div className="bg-slate-100 p-6 rounded-full mb-4">
						<Search className="h-10 w-10 text-slate-300" />
					</div>
				</div>
			</main>
		</div>
	);
}
