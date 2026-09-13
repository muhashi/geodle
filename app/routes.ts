import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("daily", "routes/daily.tsx"),
  route("random", "routes/random.tsx"),
  route("terms", "routes/terms.tsx"),
  route("privacy", "routes/privacy.tsx"),
  route("updates", "routes/updates.tsx"),
  route("*", "routes/not-found.tsx"),
] satisfies RouteConfig;
