import { useNavigate } from "@tanstack/react-router";

export function KauHeader() {
	const navigate = useNavigate();

	return (
		<header className="bg-background border-b border-border py-4 px-6 flex justify-between items-center sticky top-0 z-50">
			<div
				className="flex items-center gap-2 cursor-pointer"
				onClick={() => navigate({ to: "/" })}
			>
				<div className="font-bold text-2xl tracking-tight text-foreground">
					Kau<span className="text-green-400">Index</span>
				</div>
			</div>
			<div className="text-sm text-muted-foreground hidden sm:block">
				{/*King Abdulaziz University*/}
			</div>
		</header>
	);
}
