import { TreeNode } from "./UPGMA";

export function generateNewickString(node: TreeNode): string {
  if (node.children.length > 0) {
    const childrenStrings = node.children.map((c) => generateNewickString(c));
    return `(${childrenStrings.join(",")}):${node.branchLength.toFixed(6)}`;
  } else {
    return `${node.name}:${node.branchLength.toFixed(6)}`;
  }
}
