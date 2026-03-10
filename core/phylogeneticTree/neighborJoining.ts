import { DistanceMatrix } from "./distanceMatrix";
import { TreeNode } from "./UPGMA";

// Calculates the sum of distances from one node to all others.
// This is used to determine if a node is an outlier
function calculateNetDivergence(matrix: DistanceMatrix, i: number): number {
  let sum = 0;
  const n = matrix.length;

  for (let j = 0; j < n; j++) {
    if (i === j) continue; // Skip self

    // Access the symmetric value:
    // If i < j, the value is in the upper triangle.
    // If i > j, the value is at [j][i].
    const val = i < j ? matrix[i][j] : matrix[j][i];

    if (val !== null) {
      sum += val;
    }
  }
  return sum;
}

// Generates a Q matrix which is used to pick the next pair to merge
function computeQMatrix(matrix: DistanceMatrix): DistanceMatrix {
  const n = matrix.length;
  const qMatrix: DistanceMatrix = Array.from({ length: n }, () =>
    Array(n).fill(0),
  );

  // Pre-calculate sums using fixed divergence function
  const r = Array.from({ length: n }, (_, i) =>
    calculateNetDivergence(matrix, i),
  );

  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      // Use the upper triangle value (matrix[i][j])
      const val = matrix[i][j] || 0;

      // NJ Formula: (n-2) * d(i,j) - sum(i) - sum(j)
      const qValue = (n - 2) * val - r[i] - r[j];

      qMatrix[i][j] = qValue;
      qMatrix[j][i] = qValue; // Keep Q-matrix fully populated for findMinQ
    }
  }

  return qMatrix;
}

// Function to find minimum Q in the matrix
function findMinQ(qMatrix: DistanceMatrix): { i: number; j: number } {
  let minI = 0;
  let minJ = 1;
  let minVal = Infinity;

  for (let i = 0; i < qMatrix.length; i++) {
    for (let j = i + 1; j < qMatrix.length; j++) {
      if (qMatrix[i][j] !== null && qMatrix[i][j]! < minVal) {
        minVal = qMatrix[i][j]!;
        minI = i;
        minJ = j;
      }
    }
  }
  return { i: minI, j: minJ };
}

interface Cluster {
  name: string;
  node: TreeNode;
}

// Neighbor Joining is a variation of UPGMA which uses Q Matrix instead of raw distance matrix
// Q Matrix is used to determine the outliers in the species
// If we have a sequence which is very far from every other one, UPGMA just pairs it with the
// closest one. However, Neighbor Joining considers this by additionally calculating that
// node's distance to every other node too.
export function buildNeighborJoining(matrix: DistanceMatrix, labels: string[]) {
  // Initial clusters
  let clusters: Cluster[] = labels.map((name) => ({
    name,
    node: { name, children: [], branchLength: 0 },
  }));

  let currentMatrix = matrix.map((row) => [...row]);

  // Neighbor Joining stops when 2 nodes are left (they become the final pair)
  while (clusters.length > 2) {
    const n = clusters.length;

    // Compute Q Matrix
    const qMatrix = computeQMatrix(currentMatrix);

    // Find the i & j pair with the minimum Q value
    const { i, j } = findMinQ(qMatrix);

    // Calculate branch lengths for the children
    const rI = calculateNetDivergence(currentMatrix, i);
    const rJ = calculateNetDivergence(currentMatrix, j);

    // Formula: dist(i, parent) = 0.5 * d(i,j) + (1 / (2*(n-2))) * (rI - rJ)
    const distIParent =
      0.5 * (currentMatrix[i][j] || 0) + (rI - rJ) / (2 * (n - 2));
    const distJParent = (currentMatrix[i][j] || 0) - distIParent;

    const clusterI = clusters[i];
    const clusterJ = clusters[j];

    clusterI.node.branchLength = Math.max(0, distIParent); // Prevent negative lengths
    clusterJ.node.branchLength = Math.max(0, distJParent);

    // Create the new parent cluster
    const newNode: TreeNode = {
      name: `(${clusterI.name},${clusterJ.name})`,
      children: [clusterI.node, clusterJ.node],
      branchLength: 0,
    };

    const mergedCluster = {
      name: `(${clusterI.name},${clusterJ.name})`,
      node: newNode,
    };

    // Update the distance matrix
    const nextMatrix: DistanceMatrix = [];
    const nextClusters: Cluster[] = [];
    const remainingIndices: number[] = [];

    for (let k = 0; k < n; k++) {
      if (k !== i && k !== j) {
        nextClusters.push(clusters[k]);
        remainingIndices.push(k);
      }
    }
    nextClusters.push(mergedCluster);

    for (let row = 0; row < nextClusters.length; row++) {
      nextMatrix[row] = [];
      for (let col = 0; col < nextClusters.length; col++) {
        if (row === col) {
          nextMatrix[row][col] = 0;
        } else if (
          row === nextClusters.length - 1 ||
          col === nextClusters.length - 1
        ) {
          const otherIdxInNext = row === nextClusters.length - 1 ? col : row;
          const k = remainingIndices[otherIdxInNext];

          // NJ Distance formula to the new node:
          // d(new, k) = (d(i,k) + d(j,k) - d(i,j)) / 2
          const dist =
            ((currentMatrix[i][k] || 0) +
              (currentMatrix[j][k] || 0) -
              (currentMatrix[i][j] || 0)) /
            2;
          nextMatrix[row][col] = dist;
        } else {
          nextMatrix[row][col] =
            currentMatrix[remainingIndices[row]][remainingIndices[col]];
        }
      }
    }

    clusters = nextClusters;
    currentMatrix = nextMatrix;
  }

  // Connect the last two nodes
  const distFinal = currentMatrix[0][1];
  clusters[0].node.branchLength = (distFinal || 0) / 2;
  clusters[1].node.branchLength = (distFinal || 0) / 2;

  const root: TreeNode = {
    name: "root",
    children: [clusters[0].node, clusters[1].node],
    branchLength: 0,
  };

  return root;
}
