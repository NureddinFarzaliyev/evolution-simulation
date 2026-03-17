<script setup lang="ts">
import ToC from "@/shared/ui/ToC.vue";
</script>

<template>
  <div>
    <h1 class="h1 text-center">
      Evolution Simulation with Genetic Algorithms, Sequence Alignment Theory
      and Phylogenetic Tree Builder
    </h1>
    <p class="p">
      This project discusses the implementation of algorithms widely used in the
      field of bioinformatics, such as genetic algorithms, sequence alignment,
      and phylogenetic tree building. The project is an interactive web
      application letting users interact with these algorithms and visualize
      their results.
    </p>
    <p class="p">
      The source code for the project is available on

      <a
        href="https://github.com/nureddinfarzaliyev/evolution-simulation"
        class="a"
        target="_blank"
      >
        GitHub </a
      >.
    </p>
    <h3>Table of Contents</h3>
    <div class="flex flex-col gap-2">
      <ToC />
    </div>
  </div>
</template>
