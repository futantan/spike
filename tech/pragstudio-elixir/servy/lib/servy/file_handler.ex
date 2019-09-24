defmodule Servy.FileHandler do
  alias Servy.Conv

  def handle_file({:ok, content}, conv) do
    %Conv{conv | status: 200, resp_body: content}
  end

  def handle_file({:error, :enoent}, conv) do
    %Conv{conv | status: 500, resp_body: "File not found!"}
  end

  def handle_file({:error, reason}, conv) do
    %Conv{conv | status: 500, resp_body: "File error: #{reason}"}
  end
end
