import { useNavigate, Link } from "@tanstack/react-router";

export function KauHeader() {
	const navigate = useNavigate();

	return (
		<header className="bg-background border-b border-border py-4 px-6 flex justify-between items-center sticky top-0 z-50">
			{/* Logo and Home Link Area */}
			<div
				className="flex items-center gap-3 cursor-pointer select-none group"
				onClick={() => navigate({ to: "/" })}
			>
				{/* Logo Image */}
				<img
					src="/favicon.svg"
					alt="KAU Logo"
					className="h-10 w-10 object-contain transition-transform group-hover:scale-105"
				/>

				{/* Site Name */}
				<div className="font-bold text-2xl tracking-tight text-foreground">
					KAU<span className="text-green-600 dark:text-green-400">Index</span>
				</div>
			</div>

			{/* Right Side Actions */}
			<nav className="flex items-center gap-4">
				<Link
					to="/planner"
					className="hidden md:flex items-center font-medium text-sm text-muted-foreground hover:text-green-600 dark:hover:text-green-400 transition-colors"
					activeProps={{
						className: "text-green-600 dark:text-green-400 font-semibold",
					}}
				>
					Schedule Planner
				</Link>
				<Link
					to="/about"
					className="hidden md:flex items-center font-medium text-sm text-muted-foreground hover:text-green-600 dark:hover:text-green-400 transition-colors"
					activeProps={{
						className: "text-green-600 dark:text-green-400 font-semibold",
					}}
				>
					About
				</Link>

				{/*<div className="text-sm text-muted-foreground hidden sm:block border-l pl-4 ml-2 border-border">
					KAU
				</div>*/}
			</nav>
		</header>
	);
}
