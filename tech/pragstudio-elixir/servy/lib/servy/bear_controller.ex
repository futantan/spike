defmodule Servy.BearController do
  alias Servy.Conv
  alias Servy.Wildthings
  alias Servy.Bear

  @templates_path Path.expand("../../templates", __DIR__)

  def index(conv) do
    bears =
      Wildthings.list_bears()
      |> Enum.sort(&Bear.order_asc_by_name/2)

    render(conv, "index.html.eex", bears: bears)
  end

  def show(conv, %{"id" => id}) do
    bear = Wildthings.get_bear(id)

    render(conv, "show.html.eex", bear: bear)
  end

  def create(conv, %{"name" => name, "type" => type}) do
    %Conv{
      conv
      | status: 201,
        resp_body: "Create a #{name} named #{type} bear!"
    }
  end

  def delete(conv, %{"id" => _id}) do
    %Conv{conv | status: 403, resp_body: "Deleting a bear is forbidden!"}
  end

  defp render(conv, template, bindings) do
    content =
      @templates_path
      |> Path.join(template)
      |> EEx.eval_file(bindings)

    %Conv{conv | status: 200, resp_body: content}
  end
end
