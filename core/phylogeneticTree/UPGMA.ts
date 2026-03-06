import { DistanceMatrix } from "./phylogeneticTree";

function findMinDistance(matrix: DistanceMatrix): {
  i: number;
  j: number;
  minDist: number;
} {
  const size = matrix.length;

  let minI = 0;
  let minJ = 0;
  let minDist = Infinity;

  for (let i = 0; i < size; i++) {
    for (let j = i + 1; j < size; j++) {
      const val = matrix[i][j];
      if (val !== null && val < minDist) {
        minI = i;
        minJ = j;
        minDist = val;
      }
    }
  }

  return { i: minI, j: minJ, minDist };
}

interface TreeNode {
  name: string;
  branchLength: number;
  children: TreeNode[];
}

interface Cluster {
  id: string;
  node: TreeNode;
  indices?: number[];
  size: number;
  height: number;
}

// UPGMA is an algorithm which transforms distanca matrix into a hierarchical tree
// UPGMA stands for Unweighted Pair Group Method with Arithmetic Mean.
export function UPGMA(matrix: DistanceMatrix, labels: string[]) {
  // Initialize cluster for each sequence
  let clusters: Cluster[] = labels.map((name, index) => ({
    id: name,
    node: { name, children: [], branchLength: 0 },
    indices: [index],
    size: 1,
    height: 0,
  }));

  let currentMatrix = matrix.map((row) => [...row]);

  while (clusters.length > 1) {
    // Find the closest pair (smallest distance) in the current matrix
    const { i, j, minDist } = findMinDistance(currentMatrix);

    // Create new merged cluster
    const clusterI = clusters[i];
    const clusterJ = clusters[j];
    const newHeight = minDist / 2;

    const newNode: TreeNode = {
      name: `(${clusterI.id},${clusterJ.id})`,
      children: [clusterI.node, clusterJ.node],
      // Branch length is the distance from the new node down to the child's height
      branchLength: 0, // The root has no parent branch length yet
    };

    clusterI.node.branchLength = newHeight - (clusterI.height || 0);
    clusterJ.node.branchLength = newHeight - (clusterJ.height || 0);

    const mergedCluster: Cluster = {
      id: `(${clusterI.id},${clusterJ.id})`,
      node: newNode,
      size: clusterI.size + clusterJ.size,
      height: newHeight,
    };

    const nextMatrix: DistanceMatrix = [];
    const nextClusters: Cluster[] = [];
    const remainingOldIndices: number[] = [];

    for (let k = 0; k < clusters.length; k++) {
      if (k !== i && k !== j) {
        nextClusters.push(clusters[k]);
        remainingOldIndices.push(k);
      }
    }

    nextClusters.push(mergedCluster);
    const newClusterIdx = nextClusters.length - 1;

    for (let row = 0; row < nextClusters.length; row++) {
      nextMatrix[row] = [];
      for (let col = 0; col < nextClusters.length; col++) {
        if (row === col) {
          nextMatrix[row][col] = 0;
        } else if (row === newClusterIdx || col === newClusterIdx) {
          const otherIdxInNext = row === newClusterIdx ? col : row;
          const k = remainingOldIndices[otherIdxInNext]; // Its index in currentMatrix

          // Weighted average: (Dist I to K * Size I + Dist J to K * Size J) / (Total Size)
          const ik = currentMatrix[i][k];
          const dIK = ik !== null ? ik : 0;
          const jk = currentMatrix[j][k];
          const dJK = jk !== null ? jk : 0;
          const dist =
            (dIK * clusterI.size + dJK * clusterJ.size) /
            (clusterI.size + clusterJ.size);

          nextMatrix[row][col] = dist;
        } else {
          const oldRow = remainingOldIndices[row];
          const oldCol = remainingOldIndices[col];
          nextMatrix[row][col] = currentMatrix[oldRow][oldCol];
        }
      }
    }

    clusters = nextClusters;
    currentMatrix = nextMatrix;
  }

  return clusters[0].node;
}
