import { createFileRoute } from "@tanstack/react-router";
import { KauHeader } from "@/components/KauHeader";
import { SearchForm } from "@/components/SearchForm";
import { AdSenseUnit } from "@/components/AdSenseUnit";

export const Route = createFileRoute("/")({
	component: KauIndexHome,
});

function KauIndexHome() {
	return (
		<div className="min-h-screen bg-background flex flex-col font-sans text-foreground">
			<KauHeader />

			<main className="flex-1 flex flex-col items-center px-4 py-8 max-w-5xl mx-auto w-full">
				{/* Spacer to push content down */}
				<div className="mt-[15vh] mb-12 text-center w-full transition-all duration-500">
					<div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
						<h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight">
							Find Your <span className="text-green-400">Courses</span>
						</h1>
						<p className="text-muted-foreground mb-10 max-w-lg mx-auto text-lg">
							Search and discover courses at King Abdulaziz University with
							ease.
						</p>
					</div>

					<SearchForm overlayFilters={false} layout="hero" />
				</div>
				{/*<AdSenseUnit slot="8105192397" className="mt-12 w-full max-w-3xl" />*/}
			</main>
		</div>
	);
}
