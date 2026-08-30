import { Separator } from "@/components/ui/separator";

export function KauFooter() {
	const currentYear = new Date().getFullYear();

	return (
		<footer className="bg-background mt-auto w-full">
			<Separator />

			<div className="max-w-5xl mx-auto px-6 py-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
				{/* Brand & Copyright */}
				<div className="flex flex-col items-center md:items-start gap-1">
					<div className="flex items-center gap-2 font-bold text-foreground tracking-tight">
						<img
							src="/index-logo-light.svg"
							alt="Index logo"
							className="h-5 w-5 dark:hidden"
						/>
						<img
							src="/index-logo-dark.svg"
							alt="Index logo"
							className="h-5 w-5 hidden dark:block"
						/>
						Index
					</div>
					<span>&copy; {currentYear} All rights reserved.</span>
				</div>

				{/* The Quote */}
				<div className="hidden md:block">
					<p className="italic opacity-80">"Made by students, for students"</p>
				</div>

				{/* Mobile Quote */}
				<div className="md:hidden mt-2">
					<p className="italic opacity-80">"Made by students, for students"</p>
				</div>
			</div>
		</footer>
	);
}
