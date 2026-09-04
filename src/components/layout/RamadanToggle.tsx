import { MoonStar, Sun } from "lucide-react";
import { useRamadanStore } from "@/hooks/use-ramadan-time";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

export function RamadanToggle() {
	const { isRamadanMode, setRamadanMode } = useRamadanStore();

	return (
		<Button
			variant="outline"
			onClick={() => setRamadanMode(!isRamadanMode)}
			className={cn(
				isRamadanMode &&
					"border-green-600/40 text-green-600 hover:text-green-600 dark:border-green-400/40 dark:text-green-400 dark:hover:text-green-400",
			)}
		>
			{isRamadanMode ? (
				<MoonStar className="h-4 w-4" />
			) : (
				<Sun className="h-4 w-4" />
			)}
			{isRamadanMode ? "Ramadan Timing On" : "Standard Timing"}
		</Button>
	);
}
