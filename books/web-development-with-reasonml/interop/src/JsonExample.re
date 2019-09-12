module D = Json.Decode;

let decodedStr =
  switch (Json.parse({js|"two words"|js})) {
  | Some(jsonStr) => D.string(jsonStr)
  | None => ""
  };
Js.log(decodedStr); /* "two words" */

/* Compose array decoder with float decoder with partial application */
let floatArrayDecoder = D.array(D.float);
let decodedArray =
  Json.parse("[3.4, 5.6, 7.8]")
  ->Belt.Option.mapWithDefault([||], floatArrayDecoder);
Js.log(decodedArray); /* [|3.4, 5.6, 7.8|] */

let decodedObj =
  switch (Json.parse({|{"size": "XXL", "qty": 10}|})) {
  | Some(jsonObj) => D.field("qty", D.int, jsonObj)
  | None => 0
  };
Js.log(decodedObj); /* 10 */

type statsRecord = {
  title: string,
  choices: array(string),
  totals: array(int),
};

let objStats = {js|{"title": "color",
  "choices": ["White", "Blue", "Red", "Green", "Brown"],
  "totals": [118, 114, 73, 67,28]}
|js};

let colorStats =
  switch (Json.parse(objStats)) {
  | Some(jsonObj) => {
      title: D.field("title", D.string, jsonObj),
      choices: D.field("choices", D.array(D.string), jsonObj),
      totals: D.field("totals", D.array(D.int), jsonObj),
    }
  | None => {title: "", choices: [||], totals: [||]}
  };
Js.log(colorStats);

let sleeveStats = {
  title: "sleeve",
  choices: [|"short sleeve", "long sleeve", "extra-long sleeve"|],
  totals: [|129, 217, 54|],
};

module E = Json.Encode;

let sleeveJson =
  E.object_([
    ("title", E.string(sleeveStats.title)),
    ("choices", E.stringArray(sleeveStats.choices)),
    ("totals", E.array(E.int, sleeveStats.totals)),
  ]);

Js.log(Json.stringify(sleeveJson));
