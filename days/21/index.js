import assert from 'assert';
import '../../utils/polyfills.js';

const SPACES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

function isGameOn([player1, player2]) {
  return player1.points < 1000 & player2.points < 1000;
}

function roll(dice) {
  dice.d1 += 3;
  dice.d2 += 3;
  dice.d3 += 3;
  dice.count += 3;

  if (dice.d1 > 100) dice.d1 = dice.d1 - 100;
  if (dice.d2 > 100) dice.d2 = dice.d2 - 100;
  if (dice.d3 > 100) dice.d3 = dice.d3 - 100;
}

function move(player, dice) {
  player.position += dice.d1 + dice.d2 + dice.d3;
  player.points += SPACES[player.position % 10];
}

function solution01(p1, p2) {
  const [player1, player2] = [
    { position: p1 - 1, points: 0 },
    { position: p2 - 1, points: 0 }
  ];
  const dice = { d1: -2, d2: -1, d3: 0, count: 0 };
  const players = [player1, player2];

  while (isGameOn(players)) {
    const idx = dice.count % players.length;
    roll(dice);
    move(players[idx], dice);
  }

  if (player1.points < player2.points) {
    return player1.points * dice.count;
  }
  return player2.points * dice.count;
}

function getScoreFrequency() {
  return [].nMatrix(3).reduce((result, d1, i) => {
    [].nMatrix(3).forEach((d2, j) => {
      [].nMatrix(3).forEach((d3, k) => {
        const count = i + j + k + 3;
        result[count] = (result[count] || 0) + 1;
      });
    });
    return result;
  }, {});
}

function goStrange(players, dice) {
  const { scoreFrequency } = dice;
  const [player1, player2] = players;

  if (player1.points >= 21) return 1;
  if (player2.points >= 21) return 0;

  return Object.keys(scoreFrequency)
    .map(Number)
    .reduce((result, score) => {
      const player = players[dice.count % 2];
      const prevPosition = player.position;
      const prevPoints = player.points;

      player.position += score;
      player.points += SPACES[player.position % 10];
      dice.count++;

      result += scoreFrequency[score] * goStrange(players, dice);

      // go back to previous play
      player.position = prevPosition;
      player.points = prevPoints;
      dice.count--;

      return result;
    }, 0);
}

function solution02(p1, p2) {
  const [player1, player2] = [
    { position: p1 - 1, points: 0 },
    { position: p2 - 1, points: 0 }
  ];
  const scoreFrequency = getScoreFrequency();
  const dice = { count: 0, scoreFrequency };

  return goStrange([player1, player2], dice);
}

assert.deepEqual(solution01(4, 8), 739785);
assert.deepEqual(solution02(4, 8), 444356092776315);

assert.deepEqual(solution01(6, 2), 926610);
assert.deepEqual(solution02(6, 2), 146854918035875);
