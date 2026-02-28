// In regular smith-waterman algorithm, we use a simple scoring scheme with match, mismatch and gap scores.
// However, in real life, we have more complex scoring schemes like PAM250, which is a substitution matrix used for sequence alignment of proteins. It assigns different scores to different amino acid substitutions based on their observed frequencies in related proteins.
// Also, we need to implement Gotoh's algorithm instead of regular smith-waterman to handle affine gap penalties, which are more realistic for biological sequences. In Gotoh's algorithm, we have separate matrices for gap opening and gap extension, allowing us to penalize the opening of a gap more than the extension of an existing gap.
// While using Gotoh's we don't have to store traceback algorithm as it can be calculated

import PAM250 from "./data/pam250.json";
import { horseHemoglobin, humanHemoglobin } from "./data/proteinSequences";

type MatrixItem = number;
type MatrixRow = MatrixItem[];
type Matrix = MatrixRow[];

type TraceBackCoordinates = {
  i: number;
  j: number;
};
type TraceBackScore = number;

type Input = string;

function generateMatrix(a: Input, b: Input) {
  // matrixM: Best score ending in a match/mismatch (Diagonal)
  // matrixH: Best score ending in a gap in sequence A (Left)
  // matrixV: Best score ending in a gap in sequence B (Top)
  const matrixM: Matrix = [];
  const matrixH: Matrix = [];
  const matrixV: Matrix = [];

  // Scoring Scheme. We do not need match or mismatch anymore. Instead we are gonna use PAM250.
  // Instead of using single GAP penalty as in Smith-Waterman,
  // we are going to use seperate penalty values for opening a gap and extending it
  const GAP_OPEN = -12;
  const GAP_EXTEND = -2;

  let maxScore: TraceBackScore = 0;
  let maxCoords: TraceBackCoordinates = { i: 0, j: 0 };

  for (let i = 0; i < a.length + 1; i++) {
    const rowM: MatrixRow = [];
    const rowH: MatrixRow = [];
    const rowV: MatrixRow = [];

    for (let j = 0; j < b.length + 1; j++) {
      if (i == 0 || j == 0) {
        // Smith-Waterman initialization
        // All matrices start at 0.
        rowM.push(0);
        rowH.push(0);
        rowV.push(0);
      } else {
        const aSymbol = a[i - 1];
        const bSymbol = b[j - 1];

        // Calculate vertical gap score (MatrixV)
        // Decide: start a new gap (M + Open)
        // or extend (V + Open)
        const top = Math.max(
          matrixM[i - 1][j] + GAP_OPEN,
          matrixV[i - 1][j] + GAP_EXTEND,
        );
        rowV.push(top);

        // Calculate horizontal gap score (MatrixH)
        // Same logic.
        const left = Math.max(rowM[j - 1] + GAP_OPEN, rowH[j - 1] + GAP_EXTEND);
        rowH.push(left);

        // Instead of using regular match vs mismatch, we are gonna lookup the value from PAM250
        // Calculate Match Score (MatrixM)
        // Find the best from: Diagonal move, Vertical Gap or Horizontal gap
        const diagonal = matrixM[i - 1][j - 1] + PAM250[aSymbol][bSymbol];

        // Zero floor
        const add = Math.max(0, top, left, diagonal);
        rowM.push(add);

        // Track global maximum
        if (add > maxScore) {
          maxScore = add;
          maxCoords = { i, j };
        }
      }
    }

    matrixM.push(rowM);
    matrixV.push(rowV);
    matrixH.push(rowH);
  }

  return { matrixM, matrixH, matrixV, maxCoords, maxScore };
}

// Traceback function should be replaced with the one that asks
// "which matrix do I take the value from"
// instead of "which direction"
function traceback(
  matrixM: Matrix,
  matrixH: Matrix,
  matrixV: Matrix,
  maxCoords: TraceBackCoordinates,
  a: Input,
  b: Input,
) {
  const GAP_EXTEND = -2;

  let { i: ci, j: cj } = maxCoords;
  let alignedA = "";
  let alignedB = "";

  // Track which layer of the 3D matrix we are in
  // Start with the match matrix, as we find the max score there
  let currentMatrix: "M" | "H" | "V" = "M";

  while (ci > 0 && cj > 0) {
    // if we hit 0 in the Match matrix, local alignment ends

    if (currentMatrix === "M" && matrixM[ci][cj] === 0) break;

    if (currentMatrix === "M") {
      const score = PAM250[a[ci - 1]][b[cj - 1]];

      // Check: Did we get to this Match cell from a previous Match, or by closing a Gap?
      if (
        ci > 0 &&
        cj > 0 &&
        matrixM[ci][cj] === matrixM[ci - 1][cj - 1] + score
      ) {
        alignedA = a[ci - 1] + alignedA;
        alignedB = b[cj - 1] + alignedB;
        ci--;
        cj--;
        currentMatrix = "M";
      } else if (matrixM[ci][cj] === matrixV[ci][cj]) {
        currentMatrix = "V";
      } else if (matrixM[ci][cj] === matrixH[ci][cj]) {
        currentMatrix = "H";
      } else {
        break;
      }
    } else if (currentMatrix === "V") {
      // Check: Are we extending this vertical gap, or was it just opened from M
      alignedA = a[ci - 1] + alignedA;
      alignedB = "-" + alignedB;

      if (ci > 0 && matrixV[ci][cj] === matrixV[ci - 1][cj] + GAP_EXTEND) {
        ci--;
        currentMatrix = "V"; // Stay in Vertical layer (Extend)
      } else {
        ci--;
        currentMatrix = "M"; // Jump back to Match layer (Open/Close transition)
      }
    } else if (currentMatrix === "H") {
      // Check: Are we extending this horizontal gap, or was it just opened from M?
      alignedA = "-" + alignedA;
      alignedB = b[cj - 1] + alignedB;

      if (cj > 0 && matrixH[ci][cj] === matrixH[ci][cj - 1] + GAP_EXTEND) {
        cj--;
        currentMatrix = "H"; // Stay in Horizontal layer (Extend)
      } else {
        cj--;
        currentMatrix = "M"; // Jump back to Match layer (Open/Close transition)
      }
    }
  }

  return { alignedA, alignedB };
}

const smithWaterman = (a: string, b: string) => {
  const { matrixV, matrixH, matrixM, maxCoords } = generateMatrix(a, b);
  const { alignedA, alignedB } = traceback(
    matrixM,
    matrixH,
    matrixV,
    maxCoords,
    a,
    b,
  );
  console.log(`${alignedA}\n${alignedB}`);
};

smithWaterman(humanHemoglobin, horseHemoglobin);
