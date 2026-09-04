import { createMiddleware, createStart } from "@tanstack/react-start";

const redirectLegacyDomain = createMiddleware().server(
  async ({ request, next }) => {
    const host = (
      request.headers.get("x-forwarded-host") ||
      request.headers.get("host") ||
      ""
    )
      .toLowerCase()
      .replace(/:\d+$/, "")
      .replace(/^www\./, "");

    if (host === "kauindex.com") {
      return Response.redirect("https://kstacks.org", 301);
    }

    return next();
  },
);

export const startInstance = createStart(() => ({
  requestMiddleware: [redirectLegacyDomain],
}));
