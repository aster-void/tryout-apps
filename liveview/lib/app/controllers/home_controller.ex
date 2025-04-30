defmodule App.HomeController do
  use App, :controller

  def index(conn, _params) do
    render(conn, :index)
  end

  def hello(conn, %{"name" => name}) do
    render(conn, :hello, name: name)
  end

  def hello(conn, _params) do
    redirect(conn, to: ~p"/")
  end
end
