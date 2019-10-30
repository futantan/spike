fun main(args: Array<String>) {
  val name = "Madrigal"
  var healthPoints = 89
  val isBlessed = true
  val isImmortal = false

  val auraColor = auraColor(isBlessed, healthPoints, isImmortal)

  val healthStatus = formatHealthStatus(healthPoints, isBlessed)

  printPlayersStatus(auraColor, isBlessed, name, healthStatus)
  castFireball(5)
}

private fun printPlayersStatus(auraColor: String, isBlessed: Boolean, name: String, healthStatus: String) {
  println("(Aura: $auraColor) " + "(Blessed: ${if (isBlessed) "YES" else "NO"}")
  println("$name $healthStatus")
}

private fun auraColor(isBlessed: Boolean, healthPoints: Int, isImmortal: Boolean): String =
  if (isBlessed && healthPoints > 50 || isImmortal) "GREEN" else "NONE"

private fun castFireball(numFireballs: Int = 2) {
  println("A glass of Fireball springs into existence.(x $numFireballs)")
}

private fun formatHealthStatus(healthPoints: Int, isBlessed: Boolean): String = when (healthPoints) {
  100 -> "is in excellent condition!"
  in 90..99 -> "has a few scratches."
  in 75..89 -> if (isBlessed) "has some minor wounds but is healing quite quickly" else "has some minor wounds."
  in 15..74 -> "looks pretty hurt."
  else -> "is in awful condition!"
}
