defmodule Servy.BearView do
  require EEx

  @templates_path Path.expand("../../templates", __DIR__)

  EEx.function_from_file(:def, :index, Path.join(@templates_path, "index.html.eex"), [:bears])
  EEx.function_from_file(:def, :show, Path.join(@templates_path, "show.html.eex"), [:bear])
end
