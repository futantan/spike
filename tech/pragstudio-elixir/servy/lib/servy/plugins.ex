defmodule Servy.Plugins do
  alias Servy.Conv

  def track(%Conv{status: 404, path: path} = conv) do
    if Mix.env() != :test do
      IO.puts("Warning: #{path} is on the loose!")
    end

    conv
  end

  def track(%Conv{} = conv), do: conv

  def rewrite_path(%Conv{path: "/wildlife"} = conv) do
    %Conv{conv | path: "/wildthings"}
  end

  def rewrite_path(%Conv{path: path} = conv) do
    regex = ~r{\/(?<thing>\w+)\?id=(?<id>\d+)}
    captures = Regex.named_captures(regex, path)
    rewrite_path_captures(conv, captures)
  end

  def rewrite_path_captures(conv, %{"thing" => thing, "id" => id}) do
    %Conv{conv | path: "/#{thing}/#{id}"}
  end

  def rewrite_path_captures(conv, nil), do: conv

  def log(conv) do
    if Mix.env() == :dev do
      IO.inspect(conv)
    end

    conv
  end
end
