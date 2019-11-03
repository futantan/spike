const val TAVERN_NAME = "Taernyl's Folly"

fun main() {
  placeOrder("shandy, Dragon's Breath, 5.91")
}

private fun toDragonSpeak(phrase: String) = phrase.replace(Regex("[aeiou]")) {
  when (it.value) {
    "a" -> "4"
    "e" -> "3"
    "i" -> "1"
    "o" -> "0"
    "u" -> "|_|"
    else -> it.value
  }
}

fun placeOrder(menuData: String) {
  val indexOfApostrophe = TAVERN_NAME.indexOf('\'')
  val tavernMaster = TAVERN_NAME.substring(0 until indexOfApostrophe)
  println("Madrigal speaks with $tavernMaster about their order.")

  val data = menuData.split(',')
  val (type, name, price) = data
  val message = "Madrigal buys a $name ($type) for $price"
  println(message)

  val phrase = if (name == "Dragon's Breath") {
    "Madrigal exclaims: ${toDragonSpeak("Ah, delicious $name!")}"
  } else {
    "Madrigal says: Thanks for the $name."
  }
  println(phrase)
}
