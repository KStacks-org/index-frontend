import {
	HeadContent,
	Scripts,
	createRootRouteWithContext,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";

import type { QueryClient } from "@tanstack/react-query";

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
		],
		links: [
			{
				rel: "stylesheet",
				href: appCss,
			},
			{
				rel: "icon",
				href: "https://fav.farm/📖",
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
				{/* --- Global AdSense Script --- */}
				<script
					async
					src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1756288586646493"
					crossOrigin="anonymous"
				/>
				{/* ----------------------------- */}
			</head>
			<body>
				{children}
				<Scripts />
			</body>
		</html>
	);
}
