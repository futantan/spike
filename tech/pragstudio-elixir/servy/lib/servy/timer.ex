defmodule Timer do
  def remind(todo, seconds) do
    spawn(fn ->
      :timer.sleep(seconds * 1000)
      IO.puts(todo)
    end)
  end
end
