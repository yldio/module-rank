module.exports = score

function score (weights, criteria) {
  var totalWeight = 0
  var score = 0
  for (var k in weights) {
    var critScore = criteria[k]

    if (!Number.isInteger(critScore)) {
      critScore = critScore.score
    }

    totalWeight += weights[k]
    score += critScore * weights[k]
  }

  return (score / totalWeight).toFixed(2)
}
