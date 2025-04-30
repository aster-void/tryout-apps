defmodule App.ChatLive do
  alias Phoenix.PubSub
  use App, :live_view

  def mount(_params, _session, socket) do
    socket =
      socket
      |> assign(:name, "World!")
      |> assign(:messages, [])

    if connected?(socket) do
      PubSub.subscribe(:chat, "universal")
    end

    {:ok, socket}
  end

  def handle_event("post-message", %{"message" => msg}, socket) do
    payload = %{
      id: :rand.uniform(),
      message: msg
    }

    socket = socket |> update(:messages, &[payload | &1])
    PubSub.broadcast!(:chat, "universal", payload)
    {:noreply, socket}
  end

  def handle_info(payload, socket) do
    unless socket.assigns.messages |> Enum.any?(&(&1.id == payload.id)) do
      {:noreply, socket |> update(:messages, &[payload | &1])}
    else
      {:noreply, socket}
    end
  end
end
