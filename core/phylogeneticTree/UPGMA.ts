import { DistanceMatrix } from "./distanceMatrix";

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
  id: string; // Text representation of the cluster
  node: TreeNode; // The actual tree structure being built
  indices?: number[]; // Track original sequence indices
  size: number; // Number of leaf sequences in this cluster
  height: number; // Distance from the leaf nodes to this cluster
}

// buildUPGMA transforms a distance matrix into a hierarchical tree
// UPGMA stands for Unweighted Pair Group Method with Arithmetic Mean.
// The core principle is "Agglomerative Clustering": find the two closest items,
// merge them, and repeat until only one root cluster remains.

export function buildUPGMA(matrix: DistanceMatrix, labels: string[]) {
  // Convert each individual sequence into its own starting cluster
  let clusters: Cluster[] = labels.map((name, index) => ({
    id: name,
    node: { name, children: [], branchLength: 0 },
    indices: [index],
    size: 1,
    height: 0,
  }));

  // Create a working copy of the distance matrix that we will update as we merge clusters
  let currentMatrix = matrix.map((row) => [...row]);

  // Keep merging clusters until only one remains, which will be the root of our tree
  while (clusters.length > 1) {
    // Find the closest pair (smallest distance) in the current matrix (indices i and j)
    const { i, j, minDist } = findMinDistance(currentMatrix);

    // Identify the two clusters to be merged
    const clusterI = clusters[i];
    const clusterJ = clusters[j];

    // Calculate divergence time or height
    // In UPGMA, we assume a constant rate of evolution, so the branching point
    // is exactly half of the total distance between the two clusters.
    const newHeight = minDist / 2;

    // Create a new internal node that represents the common ancestor of clusterI and clusterJ
    const newNode: TreeNode = {
      name: `(${clusterI.id},${clusterJ.id})`,
      children: [clusterI.node, clusterJ.node], // The two merged clusters become children
      branchLength: 0, // This is 0 because this node hasn't been connected to a parent yet
    };

    // Calculate individual branch lengths for the children
    // The branch length is the distance from the NEW node (newHeight)
    // down to the existing height of the child cluster.
    // This ensures all tips end up at the same total distance (Ultrametric).
    clusterI.node.branchLength = newHeight - (clusterI.height || 0);
    clusterJ.node.branchLength = newHeight - (clusterJ.height || 0);

    // Package the merged cluster information into a new Cluster object
    const mergedCluster: Cluster = {
      id: `(${clusterI.id},${clusterJ.id})`,
      node: newNode,
      size: clusterI.size + clusterJ.size,
      height: newHeight,
    };

    // Matrix reduction
    // Prepare to shrink the matrix
    const nextMatrix: DistanceMatrix = []; // New (n-1) x (n-1) matrix
    const nextClusters: Cluster[] = []; // New list of clusters after merging
    const remainingOldIndices: number[] = []; // Maps currentMatrix indices to nextMatrix

    // Identify the clusers that were not merged in this step
    for (let k = 0; k < clusters.length; k++) {
      if (k !== i && k !== j) {
        nextClusters.push(clusters[k]);
        remainingOldIndices.push(k); // Store old index to retrieve the distances later
      }
    }

    // Add new merged cluster to the end of the list
    nextClusters.push(mergedCluster);
    const newClusterIdx = nextClusters.length - 1;

    // Re-calculate the distances between all remaining clusters and the new one.
    for (let row = 0; row < nextClusters.length; row++) {
      nextMatrix[row] = [];
      for (let col = 0; col < nextClusters.length; col++) {
        if (row === col) {
          nextMatrix[row][col] = null; // CASE 1: Distance to self is null
        } else if (row === newClusterIdx || col === newClusterIdx) {
          // CASE 2: One of the clusters is the new merged cluster
          // We must calculate its distance to an existing cluster 'K' using the Arithmetic Mean.

          // Identify which index represents the 'other' cluster we are comparing against.
          const otherIdxInNext = row === newClusterIdx ? col : row;
          const k = remainingOldIndices[otherIdxInNext]; // Its index in currentMatrix

          // Weighted average: (Dist I to K * Size I + Dist J to K * Size J) / (Total Size)
          // Look up raw distances between the unmerged 'K' and the two clusters we just joined (I and J).
          const ik = currentMatrix[i][k];
          const dIK = ik !== null ? ik : 0;
          const jk = currentMatrix[j][k];
          const dJK = jk !== null ? jk : 0;

          // UPGMA Formula: Distance is the weighted average of the distances
          // from the children to the other cluster.
          const dist =
            (dIK * clusterI.size + dJK * clusterJ.size) /
            (clusterI.size + clusterJ.size);

          nextMatrix[row][col] = dist;
        } else {
          // CASE 3: Both clusters existed previously and weren't involved in the merge.
          // We simply carry over their previous distance from the old matrix.
          const oldRow = remainingOldIndices[row];
          const oldCol = remainingOldIndices[col];
          nextMatrix[row][col] = currentMatrix[oldRow][oldCol];
        }
      }
    }

    // Overwrite old variables with the new, smaller matrix and cluster list for the next loop.
    clusters = nextClusters;
    currentMatrix = nextMatrix;
  }

  // The very last cluster remaining is the Root of the entire tree.
  return clusters[0].node;
}
