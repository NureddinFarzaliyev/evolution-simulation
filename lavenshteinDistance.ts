// Lavenshtein distance is a measure of the difference between two strings. It is defined as the minimum number of single-character edits (insertions, deletions, or substitutions) required to change one string into the other.

function generateMatrix(a: string, b: string) {
  const matrix: number[][] = [];

  for (let i = 0; i < a.length + 1; i++) {
    const row: number[] = [];

    for (let j = 0; j < b.length + 1; j++) {
      if (i == 0) {
        row.push(j);
      } else if (j == 0) {
        row.push(i);
      } else {
        const aSymbol = a[i - 1];
        const bSymbol = b[j - 1];

        const top = matrix[i - 1][j];
        const left = row[j - 1];
        const diagonal = matrix[i - 1][j - 1];

        if (aSymbol === bSymbol) {
          row.push(diagonal);
        } else {
          const min = Math.min(top, left, diagonal);
          const add = min + 1;
          row.push(add);
        }
      }
    }

    matrix.push(row);
  }

  return matrix;
}

const lavenshteinDistance = (a: string, b: string) => {
  const matrix = generateMatrix(a, b);
  return matrix[a.length][b.length];
};

const A = "benyam";
const B = "ephrem";

console.log(lavenshteinDistance(A, B));
