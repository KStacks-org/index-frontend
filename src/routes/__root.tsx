import {
	HeadContent,
	Scripts,
	createRootRouteWithContext,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";

import type { QueryClient } from "@tanstack/react-query";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { BootGate } from "@/components/providers/BootGate";

interface MyRouterContext {
	queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
	head: () => ({
		meta: [
			{
				charSet: "utf-8",
			},
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1",
			},
			{
				title: "KauIndex - Find KAU Courses & Instructors",
			},
			{
				name: "description",
				content:
					"Search and filter King Abdulaziz University courses, find instructors, and build your schedule easily with KauIndex.",
			},
			{
				name: "google-adsense-account",
				content: "ca-pub-1756288586646493",
			},
			// Recommended: Matches your manifest theme color for mobile browsers
			{
				name: "theme-color",
				content: "#ffffff",
			},
		],
		links: [
			{
				rel: "stylesheet",
				href: appCss,
			},
			// 1. Modern SVG Favicon (Preferred by modern browsers)
			{
				rel: "icon",
				type: "image/svg+xml",
				href: "/favicon.svg",
			},
			// 2. Legacy .ico Favicon (Fallback for older tools)
			{
				rel: "icon",
				sizes: "any",
				href: "/favicon.ico",
			},
			// 3. Apple Touch Icon (iOS Home Screen)
			{
				rel: "apple-touch-icon",
				href: "/apple-touch-icon.png",
			},
			// 4. Web Manifest (Android & Google Search configuration)
			{
				rel: "manifest",
				href: "/site.webmanifest",
			},
		],
	}),

	shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<head>
				<HeadContent />
			</head>
			<body>
				<ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
					<BootGate>
						{import.meta.env.VITE_IN_DEVELOPMENT != "yes" ? (
							children
						) : (
							<div className="flex items-center justify-center h-screen w-full">
								<p className="text-black dark:text-white text-center">
									This website is under development, thank you for your
									pacience.
								</p>
							</div>
						)}
					</BootGate>
				</ThemeProvider>
				<Scripts />
			</body>
		</html>
	);
}
