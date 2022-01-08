pub fn print(limit: u8) {
  let numbers = generate_sequence(limit);
  output_sequence(&numbers);
}

fn generate_sequence(limit: u8) -> Vec<u8> {
  (1..=limit).collect()
}

fn output_sequence(numbers: &[u8]) {
  for n in numbers {
    println!("{}", n);
  }
}


#[test]
fn generate_sequence_should_work() {
  let result = generate_sequence(3);
  assert_eq!(result, &[1, 2, 3]);
}
