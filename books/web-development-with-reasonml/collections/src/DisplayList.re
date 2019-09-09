let displayList = (items, stringify) => {
  let elementReducer = (accumulator, item) =>
    accumulator ++ stringify(item) ++ ",";

  "[" ++ Belt.List.reduce(items, "", elementReducer) ++ "]";
};

let items = [10, 11, 12, 13, 14, 15];
Js.log(items);
Js.log(displayList(items, string_of_int));
