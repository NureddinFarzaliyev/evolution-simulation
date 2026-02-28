// In regular smith-waterman algorithm, we use a simple scoring scheme with match, mismatch and gap scores. However, in real life, we have more complex scoring schemes like BLOSUM62, which is a substitution matrix used for sequence alignment of proteins. It assigns different scores to different amino acid substitutions based on their observed frequencies in related proteins.

import BLOSUM62 from "./data/blosum62.json";
import { horseHemoglobin, humanHemoglobin } from "./data/proteinSequences";

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

  // Scoring Scheme. We do not need match or mismatch anymore. Instead we are gonna use BLOSUM62.
  const GAP = -1;

  let maxScore: TraceBackScore = 0;
  let maxCoords: TraceBackCoordinates = { i: 0, j: 0 };

  for (let i = 0; i < a.length + 1; i++) {
    const row: MatrixRow = [];
    const traceBackRow: TraceBackMatrixRow = [];

    for (let j = 0; j < b.length + 1; j++) {
      if (i == 0 || j == 0) {
        row.push(0);
        traceBackRow.push([TraceBack.X]);
      } else {
        const aSymbol = a[i - 1];
        const bSymbol = b[j - 1];

        const top = matrix[i - 1][j] + GAP;
        const left = row[j - 1] + GAP;
        // Instead of using regular match vs mismatch, we are gonna lookup the value from BLOSUM62
        const diagonal = matrix[i - 1][j - 1] + BLOSUM62[aSymbol][bSymbol];

        const add = Math.max(0, top, left, diagonal);
        row.push(add);

        if (add > maxScore) {
          maxScore = add;
          maxCoords = { i, j };
        }

        const traceBackItem: TraceBack[] = [];
        if (add > 0) {
          if (add === diagonal) traceBackItem.push(TraceBack.D);
          if (add === top) traceBackItem.push(TraceBack.T);
          if (add === left) traceBackItem.push(TraceBack.L);
        } else {
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

  let ci = i;
  let cj = j;

  let alignedA = "";
  let alignedB = "";

  while (true) {
    const directions = traceBackMatrix[ci][cj];
    if (directions.includes(TraceBack.X)) break;
    const move = directions.includes(TraceBack.D) ? TraceBack.D : directions[0];

    switch (move) {
      case TraceBack.D:
        alignedA = a[ci - 1] + alignedA;
        alignedB = b[cj - 1] + alignedB;
        ci -= 1;
        cj -= 1;
        break;
      case TraceBack.L:
        alignedA = "-" + alignedA;
        alignedB = b[cj - 1] + alignedB;
        cj--;
        break;
      case TraceBack.T:
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

smithWaterman(humanHemoglobin, horseHemoglobin);
