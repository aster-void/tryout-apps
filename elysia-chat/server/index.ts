import cors from "@elysiajs/cors";
import { Elysia } from "elysia";
import { on, EventEmitter } from "node:events";
import { Message } from "^share/types/schema.ts";

const messages: Message[] = [];
export type EmitEvent =
  | { event: "new-message"; data: Message }
  | { event: "keep-alive" };
const emitter = new EventEmitter<{
  event: [EmitEvent];
}>();
emitter.on("event", (m) => {
  if (m.event === "new-message") {
    messages.push(m.data);
  }
});
setInterval(() => {
  emitter.emit("event", {
    event: "keep-alive",
  });
}, 8000);

const app = new Elysia()
  .use(
    cors({
      origin: "http://localhost:5173",
    }),
  )
  .get("/", () => "Hello Elysia")
  .get("/chat", async () => {
    return messages;
  })
  .post(
    "/chat",
    async ({ body }) => {
      console.log("message received:", body);
      emitter.emit("event", {
        event: "new-message",
        data: body,
      });
    },
    {
      body: Message,
    },
  )
  .get("/sse", async function* ({ set }) {
    set.headers["content-type"] = "text/event-stream";
    for await (const [_ev] of on(emitter, "event")) {
      const event = _ev as EmitEvent;
      console.log(event);
      yield event;
    }
  })
  .listen(3000);

export type App = typeof app;

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
