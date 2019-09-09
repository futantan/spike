let rec isPalindrome = (s: string): bool => {
  let len = Js.String.length(s);
  if (len <= 1) {
    true;
  } else if (Js.String.get(s, 0) != Js.String.get(s, len - 1)) {
    false;
  } else {
    isPalindrome(Js.String.slice(~from=1, ~to_=len - 1, s));
  };
};

Js.log(isPalindrome("civic"));