<template>
  <div>
    <h1>Simulation</h1>
    <h3>Overview</h3>
    <p>
      In this chapter, we are going to explore the details of combining
      previously created algorithms to build a complete computer simulation of a
      simple evolutionary process. The general roadmap is basically evolving a
      seed protein sequence over generations, and then analyzing the results by
      creating a phylogenetic tree and visualizing it.
    </p>
    <h3>Evolution</h3>
    <p>
      Initially, we have to take a seed sequence and evolve it over generations.
      This process is an implementation of the genetic algorithms. Mutation
      logic in this implementation is based on the BLOSUM62 matrix by choosing
      from the pool of candidates based on a probability weight. Along the way,
      we speciate the sequences by dividing them into two independent lineages
      marked as L (left) and R (right) lineages which can be observed from the
      final newick string. After completing the evolution process, we are going
      to have a set of sequences that are evolved from the seed sequence and are
      related to each other
    </p>
    <h3>Analyzing the Results</h3>
    <p>
      The next step is to analyze the results of the evolution process. For this
      purpose, we are going to build a phylogenetic tree based on the evolved
      sequences.
    </p>
    <h3>Distance Matrix</h3>
    <p>
      While analyzing the output protein sequences, we can build a matrix which
      consists of their relational distances. This is called a distance matrix
      and is a great way to understand the relations in a pool of sequences.
      While calculating distances in order to build the matrix, we have to take
      several measures into account.
    </p>
    <p>
      P-distance, which is one of the methods to calculate this distance, is a
      way to measure the proportional difference by dividing the number of
      mismatches by the total number of positions compared. We can either ignore
      the gaps, or tread the gap as a fifth type of a mismatch against the
      actual character. However, in our evolution process, history is as
      important as the final results. The p-distance calculation does not take
      the historical changes into account. If an amino-acid has changed from A
      to B and then back from B to A, the p-distance will consider them as
      identical, while in reality they are not. To solve this problem, we can
      apply the Jukes-Cantor correction to the p-distance. For advanced
      algorithms, Jones-Taylor-Thornton models are being utilized which
      basically are the Jukes-Cantor with BLOSUM-style logic built-in.
    </p>
    <h3>Building the Tree</h3>
    <p>
      After building the distance matrix, we can use it to build a phylogenetic
      tree. For this purpose, several strategies can be applied. One of the most
      common strategies is the UPGMA (Unweighted Pair Group Method with
      Arithmetic Mean) which is a simple hierarchical clustering method. Another
      method is Neighbor Joining. UPGMA only takes the raw distance matrix into
      account, while Neighbor Joining also considers the net divergence.
      Neighbor Joining is a bottom-up clustering method that does not assume a
      constant rate of evolution (molecular clock) and allows shorter and longer
      branches in the resulting tree. It can also produce an unrooted tree,
      which is useful when the direction of evolution is not known.
    </p>
    <h3>Visualization</h3>
    <p>
      After building the tree, we can visualize it. For this purpose, a standard
      format called Newick format is being used. This format represents the tree
      structure in a text-based format. Then, UI libraries can be used to
      visualize the tree based on the Newick string.
    </p>
    <h3>Implementation</h3>
    <p>
      Complete implementation of the simulation process can be found in the
      <a
        href="https://github.com/nureddinfarzaliyev/evolution-simulation"
        class="a"
        target="_blank"
      >
        GitHub </a
      >.
    </p>
  </div>
</template>
