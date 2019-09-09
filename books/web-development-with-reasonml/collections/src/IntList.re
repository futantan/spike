let example = [10, 11, 12];
Js.log(Belt.List.size(example));
let optElement = Belt.List.get(example, 3); /* Some(13) */
let badOptElement = Belt.List.get(example, 10); /* None */
let element = Belt.List.getExn(example, 3); /* 13 */
Js.log(optElement);
Js.log(badOptElement);
Js.log(element);
let badElement: int =
  try (Belt.List.getExn(example, 10)) {
  | Js.Exn.Error(e) =>
    switch (Js.Exn.message(e)) {
    | Some(message) => Js.log({j|Error: $message|j}) /* "Error: getExn"*/
    | None => Js.log("An unknown error occurred")
    };
    (-1);
  };
Js.log(badElement);
