defmodule Servy.BearController do
  alias Servy.Conv
  alias Servy.Wildthings
  alias Servy.Bear

  def index(conv) do
    items =
      Wildthings.list_bears()
      |> Enum.filter(&Bear.is_grizzly/1)
      |> Enum.sort(&Bear.order_asc_by_name/2)
      |> Enum.map(&bear_item/1)
      |> Enum.join()

    %Conv{conv | status: 200, resp_body: "<ul>#{items}</ul>"}
  end

  def show(conv, %{"id" => id}) do
    bear = Wildthings.get_bear(id)
    %Conv{conv | status: 200, resp_body: "<h1>Bear #{bear.id}: #{bear.name} </h1>"}
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

  defp bear_item(bear) do
    "<li>#{bear.name} - #{bear.type}</li>"
  end
end
