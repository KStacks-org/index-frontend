import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/sitemap/xml")({
	server: {
		handlers: {
			GET: async () => {
				const baseUrl = "https://kauindex.com";

				const popularSearches = [
					"computer science",
					"mathematics",
					"physics",
					"biology",
					"chemistry",
					"marketing",
				]

				const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>

  <url>
    <loc>${baseUrl}/search</loc>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>

  ${popularSearches
		.map(
			(term) => `
  <url>
    <loc>${baseUrl}/search?q=${encodeURIComponent(term)}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`,
		)
		.join("")}
</urlset>`;

				return new Response(sitemap, {
					headers: {
						"Content-Type": "application/xml",
					},
				})
			},
		},
	},
});
