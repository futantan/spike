defmodule Servy.Api.BearController do
  alias Servy.Conv

  def index(conv) do
    json =
      Servy.Wildthings.list_bears()
      |> Poison.encode!()

    conv = put_resp_content_type(conv, "application/json")
    %{conv | status: 200, resp_body: json}
  end

  def create(conv, %{"name" => name, "type" => type}) do
    %Conv{conv | status: 201, resp_body: "Created a #{type} bear named #{name}!"}
  end

  def put_resp_content_type(conv, type) do
    headers = Map.put(conv.resp_headers, "Content-Type", type)
    %{conv | resp_headers: headers}
  end
end
