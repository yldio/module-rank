module.exports = score

function score (weights, criteria) {
  var totalWeight = 0
  var score = 0
  for (var k in weights) {
    totalWeight += weights[k]
    score += criteria[k] * weights[k]
  }

  return (score / totalWeight).toFixed(2)
}
