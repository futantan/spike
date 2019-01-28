package money;

abstract class Money {

  int amount;

  static Money dollar(int amount) {
    return new Dollar(amount);
  }

  static Money franc(int amount) {
    return new Franc(amount);
  }

  abstract Money times(int multiplier);

  public boolean equals(Object obj) {
    Money money = (Money) obj;
    return amount == money.amount && getClass().equals(money.getClass());
  }
}
