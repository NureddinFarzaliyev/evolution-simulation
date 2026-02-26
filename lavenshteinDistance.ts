// Lavenshtein distance is a measure of the difference between two strings. It is defined as the minimum number of single-character edits (insertions, deletions, or substitutions) required to change one string into the other.

type MatrixItem = number;
type MatrixRow = MatrixItem[];
type Matrix = MatrixRow[];

enum TraceBack {
  X = "X",
  D = "D",
  L = "L",
  T = "T",
}
type TraceBackMatrixItem = TraceBack[];
type TraceBackMatrixRow = TraceBackMatrixItem[];
type TraceBackMatrix = TraceBackMatrixRow[];

type Input = string;

function generateMatrix(a: Input, b: Input) {
  const matrix: Matrix = [];
  const traceBackMatrix: TraceBackMatrix = [];

  for (let i = 0; i < a.length + 1; i++) {
    const row: MatrixRow = [];
    const traceBackRow: TraceBackMatrixRow = [];

    for (let j = 0; j < b.length + 1; j++) {
      if (i == 0) {
        row.push(j);
        traceBackRow.push([TraceBack.X]);
      } else if (j == 0) {
        row.push(i);
        traceBackRow.push([TraceBack.X]);
      } else {
        const aSymbol = a[i - 1];
        const bSymbol = b[j - 1];

        const top = matrix[i - 1][j];
        const left = row[j - 1];
        const diagonal = matrix[i - 1][j - 1];

        if (aSymbol === bSymbol) {
          row.push(diagonal);
          traceBackRow.push([TraceBack.D]);
        } else {
          const traceBackItem: TraceBack[] = [];
          const min = Math.min(top, left, diagonal);
          const add = min + 1;
          if (min === top) {
            traceBackItem.push(TraceBack.T);
          }
          if (min === diagonal) {
            traceBackItem.push(TraceBack.D);
          }
          if (min === left) {
            traceBackItem.push(TraceBack.L);
          }
          row.push(add);
          traceBackRow.push(traceBackItem);
        }
      }
    }

    matrix.push(row);
    traceBackMatrix.push(traceBackRow);
  }

  return { matrix, traceBackMatrix };
}

const lavenshteinDistance = (a: string, b: string) => {
  const { matrix, traceBackMatrix } = generateMatrix(a, b);
  console.log(traceBackMatrix);
  console.log(matrix);
  console.log(matrix[a.length][b.length]);
};

const A: Input = "benyam";
const B: Input = "ephrem";

lavenshteinDistance(A, B);
