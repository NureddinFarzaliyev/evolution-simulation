// Lavenshtein distance is a measure of the difference between two strings. It is defined as the minimum number of single-character edits (insertions, deletions, or substitutions) required to change one string into the other.

function generateMatrix(a: string, b: string) {
  const matrix: number[][] = [];
  const traceBackMatrix: string[][][] = [];

  for (let i = 0; i < a.length + 1; i++) {
    const row: number[] = [];
    const traceBackRow: string[][] = [];

    for (let j = 0; j < b.length + 1; j++) {
      if (i == 0) {
        row.push(j);
        traceBackRow.push(["x"]);
      } else if (j == 0) {
        row.push(i);
        traceBackRow.push(["x"]);
      } else {
        const aSymbol = a[i - 1];
        const bSymbol = b[j - 1];

        const top = matrix[i - 1][j];
        const left = row[j - 1];
        const diagonal = matrix[i - 1][j - 1];

        if (aSymbol === bSymbol) {
          row.push(diagonal);
          traceBackRow.push(["diagonal"]);
        } else {
          const traceBackItem: string[] = [];
          const min = Math.min(top, left, diagonal);
          const add = min + 1;
          if (min === top) {
            traceBackItem.push("top");
          }
          if (min === diagonal) {
            traceBackItem.push("diagonal");
          }
          if (min === left) {
            traceBackItem.push("left");
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
  return matrix[a.length][b.length];
};

const A = "benyam";
const B = "ephrem";

console.log(lavenshteinDistance(A, B));
