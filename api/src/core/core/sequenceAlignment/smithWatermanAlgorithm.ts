// Smith-Waterman algorithm is a modified version of Needleman-Wunsch algorithm.
// This algorithm is used to compare local alignment of two strings.
// While Needleman-Wunsch dynamically updates values for minimum attempts of transformation,
// Smith-Waterman dynamically creates a matrix for sequential alignments.
// If we have a long alignment, the values are getting bigger.
// So, if we find the bigger value on the matrix, and trace it back, we are gonna get the best alignment.

type MatrixItem = number;
type MatrixRow = MatrixItem[];
type Matrix = MatrixRow[];

enum TraceBack {
  X = "STOP",
  D = "D",
  L = "L",
  T = "T",
}
type TraceBackMatrixItem = TraceBack[];
type TraceBackMatrixRow = TraceBackMatrixItem[];
type TraceBackMatrix = TraceBackMatrixRow[];
type TraceBackCoordinates = {
  i: number;
  j: number;
};
type TraceBackScore = number;

type Input = string;

function generateMatrix(a: Input, b: Input) {
  const matrix: Matrix = [];
  const traceBackMatrix: TraceBackMatrix = [];

  // Scoring Scheme
  const MATCH = 2;
  const MISMATCH = -1;
  const GAP = -1;

  // Variables to track the starting point for backtrace as the coordinates of the maximum score
  let maxScore: TraceBackScore = 0;
  let maxCoords: TraceBackCoordinates = { i: 0, j: 0 };

  for (let i = 0; i < a.length + 1; i++) {
    const row: MatrixRow = [];
    const traceBackRow: TraceBackMatrixRow = [];

    for (let j = 0; j < b.length + 1; j++) {
      if (i == 0 || j == 0) {
        // Fill initial row and column with zero points and stops
        row.push(0);
        traceBackRow.push([TraceBack.X]);
      } else {
        // Get symbols
        const aSymbol = a[i - 1];
        const bSymbol = b[j - 1];

        // Get scores for top, left and diagonal maximums and add necessary scores
        const top = matrix[i - 1][j] + GAP;
        const left = row[j - 1] + GAP;
        const diagonal =
          matrix[i - 1][j - 1] + (aSymbol === bSymbol ? MATCH : MISMATCH);

        // Find which score to add by finding the maximum among them, and replacing with 0 if any is negative
        // In Needleman-Wunsch algorithm, we use minimum. Because in that case, we want to find the minimal number of steps.
        // However, in this algorihm, we need maximum, because we are assigning scores to local alignment patterns.
        const add = Math.max(0, top, left, diagonal);
        row.push(add);

        if (add > maxScore) {
          // Register maximum score values
          maxScore = add;
          maxCoords = { i, j };
        }

        const traceBackItem: TraceBack[] = [];
        if (add > 0) {
          // If add was positive, update traceback matrix accordingly
          if (add === diagonal) traceBackItem.push(TraceBack.D);
          if (add === top) traceBackItem.push(TraceBack.T);
          if (add === left) traceBackItem.push(TraceBack.L);
        } else {
          // If add was zero, add stop sign to matrix
          traceBackItem.push(TraceBack.X);
        }

        traceBackRow.push(traceBackItem);
      }
    }

    matrix.push(row);
    traceBackMatrix.push(traceBackRow);
  }

  return { matrix, traceBackMatrix, maxCoords, maxScore };
}

// After creating a traceback matrix, we can use a function to trace the most optimal alignment position and display it
function traceback(
  traceBackMatrix: TraceBackMatrix,
  maxCoords: TraceBackCoordinates,
  a: Input,
  b: Input,
) {
  const { i, j } = maxCoords;

  // for this purpose, we are gonna start with the coordinates with maximum score of alignment
  let ci = i;
  let cj = j;

  let alignedA = "";
  let alignedB = "";

  while (true) {
    const directions = traceBackMatrix[ci][cj];
    // break if encountered a stop sign
    if (directions.includes(TraceBack.X)) break;
    // find our next move or in other words, previous step from matrix
    // if we have cells with same values, prefer diagonal
    // because gaps are biologically more expensive than match/mismatch
    const move = directions.includes(TraceBack.D) ? TraceBack.D : directions[0];

    switch (move) {
      case TraceBack.D:
        // if diagonal, add original values to the aligned strings
        alignedA = a[ci - 1] + alignedA;
        alignedB = b[cj - 1] + alignedB;
        ci -= 1;
        cj -= 1;
        break;
      case TraceBack.L:
        // if came from left, add gap to a, and original value to b
        alignedA = "-" + alignedA;
        alignedB = b[cj - 1] + alignedB;
        cj--;
        break;
      case TraceBack.T:
        // if came from top, add gap to b, and original value to a
        alignedA = a[ci - 1] + alignedA;
        alignedB = "-" + alignedB;
        ci--;
        break;
      default:
        break;
    }
  }

  return { alignedA, alignedB };
}

const smithWaterman = (a: string, b: string) => {
  const { traceBackMatrix, maxCoords } = generateMatrix(a, b);
  const { alignedA, alignedB } = traceback(traceBackMatrix, maxCoords, a, b);
  console.log(`${alignedA}\n${alignedB}`);
};

const A: Input = "HEAGAWGHEE";
const B: Input = "PAWHEAE";

smithWaterman(A, B);
