import { createClient } from "^/api/client";
import type { PageLoad } from "./$types";
import { error } from "@sveltejs/kit";

export const load: PageLoad = async () => {
  const client = createClient({ fetch });
  const chat = await client.chat.get();
  if (chat.error) error(500);

  return {
    messages: chat.data,
  };
};
