fun main() {
  val name = "Madrigal"
  val healthPoints = 89
  val isBlessed = true
  val isImmortal = false

  val auraVisible = isBlessed && healthPoints > 50 || isImmortal
  val auraColor = if (auraVisible) "Green" else "NONE"

  val healthStatus = formHealthStatus(healthPoints, isBlessed)

  println("$name $healthStatus")
}

private fun formHealthStatus(healthPoints: Int, isBlessed: Boolean): String {
  return when (healthPoints) {
    100 -> "is in excellent condition!"
    in 90..99 -> "has a few scratches."
    in 75..89 -> if (isBlessed) "has some minor wounds but is healing quite quickly!" else "has some minor wounds."
    in 15..74 -> "looks pretty hurt."
    else -> "is in awful condition!"
  }
}
