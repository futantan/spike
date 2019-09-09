let keepIndices = (arr: array('a), f: 'a => bool): array(int) => {
  let rec helper = (position: int, accumulator: array(int)): array(int) =>
    if (position < Belt.Array.length(arr)) {
      f(Belt.Array.getUnsafe(arr, position))
        ? helper(
            position + 1,
            Belt.Array.concat(accumulator, [|position|]),
          )
        : helper(position + 1, accumulator);
    } else {
      accumulator;
    };
  helper(0, [||]);
};

let words = [|"cow", "aardvark", "squirrel", "fish", "snake", "capybara"|];
let isShortWord = (s: string): bool => {
  Js.String.length(s) < 6;
};
let result = keepIndices(words, isShortWord);
Js.log(result); /* result array: [|0, 3, 4|] */