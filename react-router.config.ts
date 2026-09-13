import type { Config } from "@react-router/dev/config";

export default {
  ssr: false,
  prerender: ["/", "/daily", "/random", "/terms", "/privacy", "/updates"],
} satisfies Config;
