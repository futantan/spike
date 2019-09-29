defmodule Servy.PledgeController do
  def index(conv) do
    pledges = Servy.PledgeServer.recent_pledges()
    %{conv | status: 200, resp_body: inspect(pledges)}
  end

  def create(conv, %{"name" => name, "amount" => amount}) do
    Servy.PledgeServer.create_pledge(name, String.to_integer(amount))
    %{conv | status: 201, resp_body: "#{name} pledged #{amount}!"}
  end
end
