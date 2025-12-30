import { useEffect, useRef } from "react";

type AdSenseUnitProps = {
	slot: string;
	format?: "auto" | "fluid" | "rectangle";
	responsive?: boolean;
	style?: React.CSSProperties;
	className?: string; // Add className support
};

export function AdSenseUnit({
	slot,
	format = "auto",
	responsive = true,
	style,
	className,
}: AdSenseUnitProps) {
	const adRef = useRef<HTMLModElement>(null);

	useEffect(() => {
		// Check if the ad container actually has width before requesting an ad
		if (
			adRef.current &&
			adRef.current.offsetWidth > 0 &&
			adRef.current.innerHTML === ""
		) {
			try {
				// @ts-ignore
				(window.adsbygoogle = window.adsbygoogle || []).push({});
			} catch (e) {
				console.error("AdSense push error:", e);
			}
		}
	}, []);

	return (
		// We force the wrapper to be a block element with 100% width
		<div
			className={className}
			style={{ display: "block", width: "100%", minHeight: "100px", ...style }}
		>
			<ins
				ref={adRef}
				className="adsbygoogle"
				style={{ display: "block", width: "100%" }}
				data-ad-client="ca-pub-1756288586646493"
				data-ad-slot={slot}
				data-ad-format={format}
				data-full-width-responsive={responsive}
			/>
		</div>
	);
}
