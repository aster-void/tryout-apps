import { treaty } from "@elysiajs/eden";
import type { App } from "^server";

export const createClient = ({ fetch: fetchOption }: { fetch: typeof fetch }) =>
  treaty<App>("http://localhost:3000", { fetcher: fetchOption });
