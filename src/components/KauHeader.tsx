import * as React from "react";
import { useNavigate, Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { CalendarRange } from "lucide-react";

const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

export function KauHeader() {
	const navigate = useNavigate();
	const headerRef = React.useRef<HTMLElement | null>(null);

	// ✅ Shrink state
	const [compact, setCompact] = React.useState(false);

	// ✅ Mobile-style scroll-driven hide (smooth)
	const lastY = React.useRef(0);
	const targetHide = React.useRef(0);
	const currentHide = React.useRef(0);
	const rafId = React.useRef<number | null>(null);

	React.useEffect(() => {
		lastY.current = Math.max(window.scrollY, 0);

		// Tuning knobs
		const TOP_SHOW = 24;      // always show near top
		const COMPACT_AT = 60;    // shrink after this
		const EXTRA_HIDE = 10;    // hide a tiny bit past height
		const SMOOTH = 0.22;      // higher = snappier, lower = floatier

		const tick = () => {
			const el = headerRef.current;
			if (!el) return;

			currentHide.current += (targetHide.current - currentHide.current) * SMOOTH;

			if (Math.abs(targetHide.current - currentHide.current) < 0.5) {
				currentHide.current = targetHide.current;
			}

			el.style.setProperty("--hide", `${currentHide.current}px`);

			if (currentHide.current !== targetHide.current) {
				rafId.current = requestAnimationFrame(tick);
			} else {
				rafId.current = null;
			}
		};

		const onScroll = () => {
			const y = Math.max(window.scrollY, 0);
			const dy = y - lastY.current;
			lastY.current = y;

			// shrink behavior (animated via CSS)
			setCompact(y > COMPACT_AT);

			const el = headerRef.current;
			const h = el?.getBoundingClientRect().height ?? 96;
			const maxHide = h + EXTRA_HIDE;

			if (y < TOP_SHOW) {
				targetHide.current = 0;
			} else {
				// mobile behavior: hide amount follows scroll direction
				targetHide.current = clamp(targetHide.current + dy, 0, maxHide);
			}

			if (rafId.current == null) rafId.current = requestAnimationFrame(tick);
		};

		window.addEventListener("scroll", onScroll, { passive: true });
		return () => {
			window.removeEventListener("scroll", onScroll);
			if (rafId.current != null) cancelAnimationFrame(rafId.current);
		};
	}, []);

	return (
		<>
			{/* Spacer so content doesn't jump (pick a safe max header height) */}
			<div className="h-[96px]" />

			<header
				ref={(node) => {
					headerRef.current = node;
				}}
				className={cn(
					"fixed top-2 left-0 right-0 z-50 mx-auto max-w-6xl",
					"bg-white/10 backdrop-blur-2xl backdrop-saturate-250 border border-white/15 shadow-lg",
					"will-change-transform transform-gpu",
					// ✅ mobile hide (scroll-driven, not toggled)
					"[transform:translate3d(0,calc(-1*var(--hide,0px)),0)]",
					// ✅ shrink animation
					"transition-[padding,border-radius,box-shadow] duration-300 ease-out",
					compact ? "rounded-xl px-4 py-2" : "rounded-2xl px-6 py-4"
				)}
			>
				<div className="flex justify-between items-center">
					<div
						className="flex items-center gap-3 cursor-pointer select-none group"
						onClick={() => navigate({ to: "/" })}
					>
						<img
							src="/favicon.svg"
							alt="KAU Logo"
							className={cn(
								"object-contain transition-[width,height] duration-300 ease-out",
								compact ? "h-8 w-8" : "h-10 w-10"
							)}
						/>

						<div
							className={cn(
								"font-bold tracking-tight text-white/90 transition-[font-size] duration-300 ease-out",
								compact ? "text-xl" : "text-2xl"
							)}
						>
							Kau<span className="text-green-600 dark:text-green-400">Index</span>
						</div>
					</div>

					<nav className="flex items-center gap-4">

						<Link

							to="/planner"
							className={cn(
								"hidden md:inline-flex items-center gap-2",
								"font-medium text-sm leading-none",
								"text-white/90 hover:text-green-700/90 transition-colors"
							)}

							activeProps={{
								className: "bg-white/10 text-white/90 border-white/20",
							}}
						>

							<CalendarRange className="text-white/90 hidden md:inline-flex items-center font-medium text-sm"></CalendarRange>
							Schedule Planner
						</Link>
					</nav>
				</div>
			</header>
		</>
	);
}
