defmodule App.ChatLive do
  alias Phoenix.PubSub
  use App, :live_view

  def mount(_params, _session, socket) do
    socket =
      socket
      |> assign(:messages, [])

    if connected?(socket) do
      PubSub.subscribe(:chat, "universal")
    end

    {:ok, socket}
  end

  def handle_event("post-message", %{"message" => msg}, socket) do
    PubSub.broadcast!(:chat, "universal", msg)
    {:noreply, socket}
  end

  def handle_info(msg, socket) do
    {:noreply, socket |> update(:messages, &[msg | &1])}
  end
end
