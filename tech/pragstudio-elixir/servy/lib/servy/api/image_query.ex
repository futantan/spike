defmodule ImageApi do
  def query(id) do
    api_url(id)
    |> HTTPoison.get()
    |> handle_response
  end

  defp api_url(id) do
    "https://api.myjson.com/bins/#{URI.encode(id)}"
  end

  defp handle_response({:ok, %{status_code: 200, body: body}}) do
    image_url =
      body
      |> Poison.Parser.parse!(%{})
      |> get_in(["image", "image_url"])

    {:ok, image_url}
  end

  defp handle_response({:ok, %{status_code: _status, body: body}}) do
    message =
      body
      |> Poison.Parser.parse!(%{})
      |> get_in(["message"])

    {:error, message}
  end

  defp handle_response({:error, %{reason: reason}}) do
    {:error, reason}
  end
end
