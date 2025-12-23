import { useNavigate } from "@tanstack/react-router";

export function KauHeader() {
	const navigate = useNavigate();

	return (
		<header className="bg-white border-b py-4 px-6 flex justify-between items-center sticky top-0 z-50">
			<div
				className="flex items-center gap-2 cursor-pointer"
				onClick={() => navigate({ to: "/" })}
			>
				<div className="font-bold text-2xl tracking-tight text-slate-900">
					Kau<span className="text-amber-500">Index</span>
				</div>
			</div>
			<div className="text-sm text-slate-500 hidden sm:block">
				King Abdulaziz University
			</div>
		</header>
	);
}
