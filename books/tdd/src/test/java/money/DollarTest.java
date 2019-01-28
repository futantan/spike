package money;

import org.junit.Test;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotEquals;
import static org.junit.Assert.assertTrue;

public class DollarTest {

  @Test
  public void testMultiplication() {
    Dollar five = new Dollar(5);
    assertEquals(new Dollar(10), five.times(2));
    assertEquals(new Dollar(15), five.times(3));
  }

  @Test
  public void testEquality() {
    assertEquals(new Dollar(5), new Dollar(5));
    assertNotEquals(new Dollar(5), new Dollar(6));
    assertEquals(new Franc(5), new Franc(5));
    assertNotEquals(new Franc(5), new Franc(6));
  }

  @Test
  public void testFrancMultiplication() {
    Franc five = new Franc(5);
    assertEquals(new Franc(10), five.times(2));
    assertEquals(new Franc(15), five.times(3));
  }
}
