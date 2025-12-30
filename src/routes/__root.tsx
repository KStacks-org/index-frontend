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
				<script
					async
					src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1756288586646493"
					crossOrigin="anonymous"
				></script>
			</head>
			<body>
				{children}
				<Scripts />
				<script
					async
					src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1756288586646493"
					crossOrigin="anonymous"
				></script>
				<ins
					className="adsbygoogle"
					style={{ display: "block" }}
					data-ad-client="ca-pub-1756288586646493"
					data-ad-slot="8105192397"
					data-ad-format="auto"
					data-full-width-responsive="true"
				></ins>
				<script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
			</body>
		</html>
	);
}
