defmodule Servy.PledgeServer do
  def listen_loop do
    IO.puts("\nWaiting for a message...")

    receive do
      {:create_pledge, name, amount} ->
        {:ok, id} = send_pledge_to_service(name, amount)
        cache = [{name, amount}]
        IO.puts("#{name} pledged #{amount}!")
        listen_loop()
    end
  end

  def create_pledge(name, amount) do
  end
end
