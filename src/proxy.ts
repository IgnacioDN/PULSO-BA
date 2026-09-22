import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

// En Next.js 16 el antiguo "middleware.ts" pasó a llamarse "proxy.ts"
export default createMiddleware(routing);

export const config = {
  // Ignora /api, /_next, /_vercel y cualquier archivo con extensión (imágenes, etc.)
  matcher: "/((?!api|_next|_vercel|.*\\..*).*)",
};
