import { createFileRoute } from "@tanstack/react-router";
import { KauHeader } from "@/components/KauHeader";
import { SearchForm } from "@/components/SearchForm";
import DarkVeil from '@/components/DarkVeil';
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion"

export const Route = createFileRoute("/")({
	component: KauIndexHome,
});

function KauIndexHome() {
	return (
		<div className="min-h-screen bg-black flex flex-col font-sans text-foreground">

			{/* Background layer */}
			<div className=" fixed inset-0 z-0 pointer-events-none bg-cover bg-no-repeat bg-center">
				<DarkVeil speed={0.5} hueShift={70} scanlineFrequency={0.5} scanlineIntensity={0.4}/>
			</div>
			<KauHeader />

			<div className="relative z-10 flex flex-col min-h-screen">

			<main className="flex-1 flex flex-col items-center px-4 py-8 max-w-5xl mx-auto w-full">
				{/* Spacer to push content down */}
				<div className="mt-[15vh] mb-12 text-center w-full transition-all duration-500">
					<div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
						<h1 className="text-3xl md:text-5xl font-extrabold mb-6 tracking-tight text-white/90">
							Find Your <span className="text-green-600">Courses</span>
						</h1>
						<p className="text-muted-foreground mb-10 max-w-lg mx-auto text-lg">
							Search and discover courses at King Abdulaziz University with
							ease.
						</p>
					</div>

					<SearchForm overlayFilters={false} layout="hero" />
				</div>
							<div className="w-full max-w-2xl bg-white/12 border border-white/10 rounded-md p-9 text-white/90 shadow-lg backdrop-blur-lg backdrop-saturate-150 animate-in fade-in slide-in-from-bottom-8 duration-700	">
						<h1 className="text-xl font-bold mb-4">Frequently Asked Questions</h1>
						<Accordion
							type="single"
							collapsible
							className="w-full max-w-2xl"
							defaultValue="item-1"
						>
							<AccordionItem value="item-1">
								<AccordionTrigger className="text-base">Is This Project Affiliated With KAU? </AccordionTrigger>
								<AccordionContent className="flex flex-col gap-4 text-balance text-base">
									<p>
										No, this project is not officially affiliated with King Abdulaziz
										University. It is an independent initiative developed to assist
										students in finding course information more easily.
									</p>
								</AccordionContent>
							</AccordionItem>
							<AccordionItem value="item-2">
								<AccordionTrigger className="text-base">Do I Need an Account? </AccordionTrigger>
								<AccordionContent className="flex flex-col gap-4 text-balance text-base">
									<p>
										We don’t support accounts at all. There’s no sign-up or login, and we don’t collect or store personal data.
									</p>
								</AccordionContent>
							</AccordionItem>
							<AccordionItem value="item-3">
								<AccordionTrigger className="text-base">Does SimplerKAU Register For Me? </AccordionTrigger>
								<AccordionContent className="flex flex-col gap-4 text-balance text-base">
									<p>
										No, it's Planning/Searching Only, SimplerKAU does not handle course registration. You will need to register for courses through the official KAU registration system.
									</p>
								</AccordionContent>
							</AccordionItem>
						</Accordion>
					</div>
			</main>
			</div>
		</div>
	);
}
