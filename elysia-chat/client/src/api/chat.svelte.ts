import type { Message } from "^share/types/schema.ts";
import { createClient } from "./client.ts";
import { browser } from "$app/environment";
import type { EmitEvent } from "^server";

export type Chat = {
  loading: boolean;
  messages: Message[];
  push: (message: string) => Promise<void>;
};

export function useChat(username: string, messages: Message[]): Chat {
  const client = createClient({ fetch });
  const states = $state<Chat>({
    loading: true,
    messages,
    async push(message: string) {
      const { error } = await client.chat.post({
        author: username,
        content: message,
      });
      if (error) throw error;
    },
  });

  if (!browser) return states;

  (async () => {
    states.loading = false;
    try {
      const { data: stream, error: sseError } = await client.sse.get();
      if (sseError) {
        throw sseError;
      }
      for await (const ev of stream) {
        if (ev.event === "new-message") {
          states.messages.push(ev.data);
        }
      }
    } catch (err) {
      console.error("sseError:", err);
      return;
    }
  })();

  return states;
}
