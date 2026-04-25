<template>
  <svg ref="svgRef" :width="width" :height="svgHeight" />
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import * as d3 from "d3";

interface NewickNode {
  name: string;
  length: number;
  children: NewickNode[];
}

function parseNewick(s: string): NewickNode {
  s = s.trim().replace(/;$/, "");
  let idx = 0;

  function parseNode(): NewickNode {
    const node: NewickNode = { name: "", length: 0, children: [] };

    if (s[idx] === "(") {
      idx++; // consume '('
      node.children.push(parseNode());
      while (s[idx] === ",") {
        idx++;
        node.children.push(parseNode());
      }
      if (s[idx] === ")") idx++; // consume ')'
    }

    // Read name (and possibly inline ':length')
    let token = "";
    while (idx < s.length && !",):".includes(s[idx]!)) token += s[idx++];

    const colonIdx = token.indexOf(":");
    if (colonIdx !== -1) {
      node.name = token.slice(0, colonIdx);
      node.length = parseFloat(token.slice(colonIdx + 1)) || 0;
    } else {
      node.name = token;
      // Check for a trailing ':length' after the name
      if (s[idx] === ":") {
        idx++;
        let lenStr = "";
        while (idx < s.length && !",)".includes(s[idx]!)) lenStr += s[idx++];
        node.length = parseFloat(lenStr) || 0;
      }
    }

    return node;
  }

  return parseNode();
}

const props = withDefaults(
  defineProps<{
    newick: string;
    width?: number;
    rowHeight?: number;
    marginRight?: number;
    showBranchLengths?: boolean;
  }>(),
  {
    width: 800,
    rowHeight: 28,
    marginRight: 160,
    showBranchLengths: true,
  },
);

const svgRef = ref<SVGSVGElement | null>(null);

// Compute scaled x (from root) using actual branch lengths
function computeScaledPositions(root: d3.HierarchyNode<NewickNode>) {
  root.each((node) => {
    (node as any).scaledX = 0;
  });
  root.each((node) => {
    if (node.parent) {
      (node as any).scaledX =
        (node.parent as any).scaledX + (node.data.length ?? 0);
    }
  });
  const maxX = d3.max(root.leaves(), (d) => (d as any).scaledX) ?? 1;
  return maxX;
}

const leafCount = computed(() => {
  try {
    const root = d3.hierarchy(parseNewick(props.newick), (n) =>
      n.children?.length ? n.children : null,
    );
    return root.leaves().length;
  } catch {
    return 8;
  }
});

const svgHeight = computed(() => leafCount.value * props.rowHeight + 60);

function draw() {
  const svg = d3.select(svgRef.value!);
  svg.selectAll("*").remove();

  const margin = { top: 20, right: props.marginRight, bottom: 40, left: 20 };
  const innerW = props.width - margin.left - margin.right;
  const innerH = svgHeight.value - margin.top - margin.bottom;

  let root: d3.HierarchyNode<NewickNode>;
  try {
    root = d3.hierarchy(parseNewick(props.newick), (n) =>
      n.children?.length ? n.children : null,
    );
  } catch (e) {
    console.error("Newick parse error:", e);
    return;
  }

  // Cluster layout assigns y positions (we override x with branch lengths)
  const cluster = d3.cluster<NewickNode>().size([innerH, innerW]);
  cluster(root);

  const maxX = computeScaledPositions(root);
  const xScale = d3.scaleLinear().domain([0, maxX]).range([0, innerW]);

  // Override .y with branch-length-scaled x
  root.each((node) => {
    (node as any).y = xScale((node as any).scaledX);
  });

  const g = svg
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // Links — right-angle elbow paths
  g.append("g")
    .attr("class", "links")
    .selectAll<SVGPathElement, d3.HierarchyLink<NewickNode>>("path")
    .data(root.links())
    .join("path")
    .attr("fill", "none")
    .attr("stroke", "#aaa")
    .attr("stroke-width", 1.5)
    .attr("d", (d) => {
      const sy = (d.source as any).x as number;
      const sx = (d.source as any).y as number;
      const ty = (d.target as any).x as number;
      const tx = (d.target as any).y as number;
      return `M${tx},${ty} H${sx} V${sy}`;
    });

  // Nodes
  const node = g
    .append("g")
    .selectAll<SVGGElement, d3.HierarchyNode<NewickNode>>("g")
    .data(root.descendants())
    .join("g")
    .attr("transform", (d) => `translate(${(d as any).y},${(d as any).x})`);

  node
    .append("circle")
    .attr("r", (d) => (d.children ? 3 : 4.5))
    .attr("fill", (d) => (d.children ? "#888" : "#1D9E75"));

  // Leaf labels
  node
    .filter((d) => !d.children)
    .append("text")
    .attr("x", 10)
    .attr("dy", "0.32em")
    .attr("font-size", 13)
    .attr("font-family", "monospace")
    .attr("fill", "#aaa")
    .text((d) => d.data.name);

  // Branch length labels (midpoint of each edge)
  if (props.showBranchLengths) {
    node
      .filter((d) => !!d.parent && d.data.length > 0)
      .append("text")
      .attr("x", (d) => ((d.parent as any).y - (d as any).y) / 2)
      .attr("dy", -4)
      .attr("text-anchor", "middle")
      .attr("font-size", 10)
      .attr("fill", "#aaa")
      .text((d) => d.data.length.toFixed(3));
  }

  // Scale bar
  const scaleBarLen = xScale(maxX * 0.25);
  const sbY = svgHeight.value - margin.bottom + 12;
  const scaleG = svg
    .append("g")
    .attr("transform", `translate(${margin.left},0)`);
  scaleG
    .append("line")
    .attr("x1", 0)
    .attr("x2", scaleBarLen)
    .attr("y1", sbY)
    .attr("y2", sbY)
    .attr("stroke", "#aaa");
  scaleG
    .append("line")
    .attr("x1", 0)
    .attr("x2", 0)
    .attr("y1", sbY - 4)
    .attr("y2", sbY + 4)
    .attr("stroke", "#aaa");
  scaleG
    .append("line")
    .attr("x1", scaleBarLen)
    .attr("x2", scaleBarLen)
    .attr("y1", sbY - 4)
    .attr("y2", sbY + 4)
    .attr("stroke", "#aaa");
  scaleG
    .append("text")
    .attr("x", scaleBarLen / 2)
    .attr("y", sbY + 14)
    .attr("text-anchor", "middle")
    .attr("font-size", 11)
    .attr("fill", "#aaa")
    .text((maxX * 0.25).toFixed(3));
}

onMounted(draw);
watch(() => [props.newick, props.width, props.showBranchLengths], draw);
</script>
