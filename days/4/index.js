import assert from 'assert';
import read from '../../utils/read.js';

/**
 * 3D matrix
 * array of boards
 * each board is an array of rows
 * each row is an array of objects
 * each object { n, marked }
 *  'n' is the number and
 *  'marked' is the flag if it's called or not for bingo
 *
 * @param list
 * @return {*}
 */
function getBingoBoards(list) {
  return list.reduce((prev, curr, i) => {
    if (i === 0) return prev;
    const board = Math.floor((i - 1) / 5);
    if (!prev[board]) prev[board] = [];
    // row bing board
    const row = curr.split(' ').filter((n) => !!n)
      .map((n) => ({ n, marked: false }));
    prev[board].push(row);
    return prev;
  }, []);
}

function boardBingo(board) {
  const rowCheck = board.some((row) => {
    return row.every((obj) => obj.marked);
  });
  if (rowCheck) return true;

  let columnCheck;
  for (let x = 0; x < 5; x++) {
    let innerCheck = true;
    for(let y = 0; y < 5; y++) {
      if (!board[y][x].marked) {
        innerCheck = false;
      }
    }
    if (innerCheck) {
      columnCheck = true;
      break;
    }
  }
  return columnCheck;
}

function isBingo(boards, deny = []) {
  return boards.findIndex((board, i) => deny.indexOf(i) < 0 &&  boardBingo(board, i));
}

function allBingo(boards) {
  return boards.every((board) => boardBingo(board));
}

function markBoards(boards, ball) {
  boards.forEach((board, i) => {
    board.forEach((row, x) => {
      row.forEach((obj, y) => {
        if (obj.n === ball) {
          boards[i][x][y].marked = true;
        }
      });
    });
  });
}

function sumUnmarked(board) {
  return [].concat.apply([], board)
    .filter((obj) => !obj.marked)
    .map((obj) => obj.n).sumAll();
}

function solution01(list) {
  const bingoBalls = list[0].split(',');
  const boards = getBingoBoards(list);

  let i = 0;
  let bingoBoard = isBingo(boards);
  while(bingoBoard < 0) {
    markBoards(boards, bingoBalls[i]);
    i++;
    bingoBoard = isBingo(boards);
  }

  const winnerBoard = boards[bingoBoard];
  const winnerBall = bingoBalls[i - 1];
  const unmarkSum = sumUnmarked(winnerBoard);

  return unmarkSum * winnerBall;
}


function solution02(list) {
  const bingoBalls = list[0].split(',');
  const boards = getBingoBoards(list);

  let i = 0;
  let bingoBoard = isBingo(boards);
  let deny = bingoBoard >= 0 ? [bingoBoard] : [];
  let all = allBingo(boards);
  while(!all) {
    markBoards(boards, bingoBalls[i]);
    i++;
    bingoBoard = isBingo(boards, deny);
    deny = [...deny, bingoBoard];
    all = allBingo(boards);
  }

  const winnerBoard = boards[bingoBoard];
  const winnerBall = bingoBalls[i - 1];
  const unmarkSum = sumUnmarked(winnerBoard);

  return unmarkSum * winnerBall;
}

read('./4/test.txt').then((list) => {
  assert.deepEqual(solution01(list), 4512);
  assert.deepEqual(solution02(list), 1924);
});

read('./4/input.txt').then((list) => {
  assert.deepEqual(solution01(list), 25023);
  assert.deepEqual(solution02(list), 2634);
});
