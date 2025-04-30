defmodule App.TemplateController do
  use App, :controller

  def home(conn, _params) do
    render(conn, :home, layout: false)
  end
end
