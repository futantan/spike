import java.lang.Exception
import java.lang.IllegalStateException

fun main() {
  var swordsJuggling: Int? = null
  val isJugglingProficient = (1..3).shuffled().last() == 3
  if (isJugglingProficient) {
    swordsJuggling = 2
  }
  try {
    proficiencyCheck(swordsJuggling)
    swordsJuggling = swordsJuggling!!.plus(1)
  } catch (e: Exception) {
    print(e)
  }
  println("You juggle $swordsJuggling swords!")
}

fun proficiencyCheck(swordsJuggling: Int?) {
  checkNotNull(swordsJuggling, {"Player cannot juggle swords"})
//  swordsJuggling ?: throw UnskilledSwordJugglerException()
}

class UnskilledSwordJugglerException() : IllegalStateException("Player cannot juggle swords")
