let rec keepIndices =
        (
          arr: array('a),
          position: int,
          accumulator: array(int),
          f: 'a => bool,
        )
        : array(int) =>
  if (position < Belt.Array.length(arr)) {
    keepIndices(
      arr,
      position + 1,
      f(Belt.Array.getUnsafe(arr, position))
        ? Belt.Array.concat(accumulator, [|position|]) : accumulator,
      f,
    );
  } else {
    accumulator;
  };