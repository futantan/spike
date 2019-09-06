let toFloat = (str: string): option(float) => {
  let result = Js.Float.fromString(str);
  if (Js.Float.isNaN(result)) {
    None;
  } else {
    Some(result);
  };
};

let cube = (x: float): float => x *. x *. x;

let reciprocal = (x: float): option(float) =>
  if (x !== 0.0) {
    Some(1.0 /. x);
  } else {
    None;
  };

let method1 = (input: string): unit => {
  let x = toFloat(input);
  let oneOver =
    switch (x) {
    | Some(value) => reciprocal(value)
    | None => None
    };
  let result =
    switch (oneOver) {
    | Some(value) => Some(cube(value))
    | None => None
    };
  let output =
    switch (result) {
    | Some(value) => Some(Js.Float.toFixedWithPrecision(value, ~digits=3))
    | None => None
    };
  let resultText =
    switch (output) {
    | Some(value) => "The result is " ++ value
    | None => "Could not calculate result."
    };
  Js.log(resultText);
};

method1("2.0"); /* output: The result is 0.125 */

let method2 = (input: string): unit => {
  let x = toFloat(input);
  let oneOver = Belt.Option.flatMap(x, reciprocal);
  let result = Belt.Option.map(oneOver, cube);
  let output =
    Belt.Option.map(result, Js.Float.toFixedWithPrecision(~digits=3));
  let resultText =
    switch (output) {
    | Some(value) => "The result is " ++ value
    | None => "Could not calculate result."
    };
  Js.log(resultText);
};

method2("2.0"); /* output: The result is 0.125 */

let makeDisplayText = (s: option(string)): string => {
  switch (s) {
  | Some(value) => "The result is " ++ value
  | None => "Could not calculate result."
  };
};

let method3 = (input: string): unit => {
  toFloat(input)
  |> Belt.Option.flatMap(_, reciprocal)
  |> Belt.Option.map(_, cube)
  |> Belt.Option.map(_, Js.Float.toFixedWithPrecision(~digits=3))
  |> makeDisplayText(_)
  |> Js.log(_);
};

method3("2.0"); /* output: The result is 0.125 */

// let method4 = (input: string): unit => {
//   toFloat(input)
//   -> Belt.Option.flatMap(reciprocal)
//   -> Belt.Option.map(cube)
//   -> Belt.Option.map(Js.Float.toFixedWithPrecision(~digits=3))
//   -> makeDisplayText
//   -> Js.log
// };

// method4("2.0"); /* output: The result is 0.125 */
