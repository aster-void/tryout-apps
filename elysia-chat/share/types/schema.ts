import { t, type Static } from "elysia";
export const Message = t.Object({
  author: t.String(),
  content: t.String(),
});
export type Message = Static<typeof Message>;
