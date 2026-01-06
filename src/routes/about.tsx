import { createFileRoute } from "@tanstack/react-router";
import { Info } from "lucide-react";
import { KauHeader } from "@/components/layout/KauHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import { KauFooter } from "@/components/layout/KauFooter";

// Official X Logo Component
const XLogo = ({ className }: { className?: string }) => (
	<svg
		viewBox="0 0 24 24"
		aria-hidden="true"
		className={cn("fill-current", className)}
	>
		<path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
	</svg>
);

export const Route = createFileRoute("/about")({
	component: AboutPage,
});

function AboutPage() {
	const PROJECT_X_URL = "https://x.com/KAUIndex";

	const team = [
		{
			name: "Tariq",
			roles: ["Founder", "Frontend Developer", "Backend Developer"],
			initials: "TA",
			imagePath: "/team/invct.jpeg",
			zoomLevel: "100",
			x: "https://x.com/iinvct",
		},
		{
			name: "Yassir",
			roles: ["Co-Founder", "Frontend Developer", "UI/UX"],
			initials: "YA",
			imagePath: "/team/lock.png",
			zoomLevel: "140",
			x: "https://x.com/aloufiyasir",
		},
		{
			name: "Abdulrahman",
			roles: ["QA Tester", "Media Manager"],
			initials: "AB",
			imagePath: "/team/adulrahman.jpg",
			zoomLevel: "100",
			x: "https://x.com/alaamryFCIT",
		},
	];

	return (
		<div className="min-h-screen bg-background flex flex-col font-sans text-foreground">
			<KauHeader />

			<main className="flex-1 flex flex-col items-center px-4 py-12 max-w-5xl mx-auto w-full">
				{/* Main Content Container with Animation */}
				<div className="w-full max-w-3xl animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-12">
					{/* Intro Section */}
					<div className="text-center space-y-6">
						<div className="space-y-2">
							<h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
								{/* FIX: Use conditional green for readability in light mode */}
								About{" "}
								<span className="text-green-600 dark:text-green-400">
									KAUIndex
								</span>
							</h1>
							{/* Project X Link */}
							<a
								href={PROJECT_X_URL}
								target="_blank"
								rel="noopener noreferrer"
								className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors py-1 px-3 rounded-full bg-secondary/50 border border-border/50"
							>
								<XLogo className="h-3 w-3" />
								<span>Follow @KAUIndex</span>
							</a>
						</div>
						<p className="text-muted-foreground text-lg leading-relaxed">
							KAUIndex is a student-built search engine and schedule planner
							designed to help King Abdulaziz University students discover
							courses and instructors with ease. Our goal is to simplify the
							registration process by providing clear, accessible data.
						</p>
					</div>

					{/* Important Notice */}
					<Alert className="bg-secondary/30 border-border backdrop-blur-sm">
						<Info className="h-4 w-4" />
						<AlertTitle className="font-semibold text-lg mb-2">
							Important Notice
						</AlertTitle>
						<AlertDescription className="text-muted-foreground">
							<span>
								KAUIndex is an independent student project. It is{" "}
								<span className="font-bold text-foreground">not</span> an
								official KAU website, nor is it a replacement for the official
								Odus Plus registration system. Please use this tool for planning
								and discovery purposes only.
							</span>
						</AlertDescription>
					</Alert>

					{/* Team Section */}
					<div className="pt-8">
						<h2 className="text-3xl font-bold text-center mb-8">The Team</h2>

						<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
							{team.map((member) => (
								<Card
									key={member.name}
									className="bg-card/50 hover:bg-card hover:shadow-md transition-all duration-300 border-border"
								>
									<CardHeader className="flex flex-col items-center pb-2">
										<Avatar className={cn("h-16 w-16 mb-2 border-2 bg-muted")}>
											<AvatarImage
												className={cn(
													"bg-black scale-[" + member.zoomLevel + "%]",
												)}
												src={member.imagePath}
												alt={member.name}
											/>
											<AvatarFallback className="bg-black text-green-700 dark:text-green-400 font-bold text-xl">
												{member.initials}
											</AvatarFallback>
										</Avatar>

										<div className="flex items-center gap-2">
											<CardTitle className="text-xl font-bold">
												{member.name}
											</CardTitle>
											<a
												href={member.x}
												target="_blank"
												rel="noopener noreferrer"
												className="text-muted-foreground hover:text-foreground transition-colors"
												aria-label={`Visit ${member.name}'s X profile`}
											>
												<XLogo className="h-3.5 w-3.5" />
											</a>
										</div>
									</CardHeader>
									<CardContent className="flex flex-col items-center gap-2">
										<div className="flex flex-wrap justify-center gap-2">
											{member.roles.map((role) => (
												<Badge
													key={role}
													variant="secondary"
													className="text-muted-foreground hover:text-foreground transition-colors"
												>
													{role}
												</Badge>
											))}
										</div>
									</CardContent>
								</Card>
							))}
						</div>
					</div>
				</div>
			</main>
			<KauFooter />
		</div>
	);
}
