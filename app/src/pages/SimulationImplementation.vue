<script setup lang="ts">
import { ref } from "vue";
import type { SimulateEvolutionParams } from "../../../api/src/core/core/simulation/simulateEvolution";
import { humanCOX1 } from "../../../api/src/core/data/proteinSequences";
import InputLabelGroup from "@/shared/ui/InputLabelGroup.vue";
import PhyloTree from "@/shared/ui/PhyloTree.vue";

const loading = ref(false);
const newick = ref<string>("");
const sequences = ref<{ name: string; sequence: string }[]>([]);

const params = ref<SimulateEvolutionParams>({
  seed: humanCOX1 + humanCOX1,
  depth: 3,
  mutationsPerBranch: 80,
  mutationRate: 0.003,
});

const simulate = async () => {
  loading.value = true;
  newick.value = "";
  sequences.value = [];

  const queryParams = new URLSearchParams({
    seed: params.value.seed,
    depth: String(params.value.depth),
    mutationsPerBranch: String(params.value.mutationsPerBranch),
    mutationRate: String(params.value.mutationRate),
  }).toString();

  try {
    const response = await fetch(
      `http://localhost:3000/simulation?${queryParams}`,
    );

    const result = await response.json();
    newick.value = result.newick;
    sequences.value = result.sequences;
  } catch (error) {
    console.error("Error fetching simulation result:", error);
  } finally {
    loading.value = false;
  }
};
</script>
<template>
  <div class="bg-bg-primary">
    <h1>Complete Simulation Implementation</h1>
    <h3>Configure Simulation Parameters</h3>

    <InputLabelGroup
      label="Seed Sequence (Example: Human COX1)"
      v-model="params.seed"
      placeholder="Seed sequence"
    />
    <InputLabelGroup
      label="Tree Depth"
      v-model="params.depth"
      placeholder="Tree depth (e.g., 3)"
    />
    <InputLabelGroup
      label="Mutations Per Branch"
      v-model="params.mutationsPerBranch"
      placeholder="Number of mutations per branch (e.g., 80)"
    />
    <InputLabelGroup
      label="Mutation Rate"
      v-model="params.mutationRate"
      placeholder="Mutation rate (e.g., 0.003)"
    />

    <button class="button my-5" @click="simulate" :disabled="loading">
      {{ loading ? "Simulating..." : "Run Simulation" }}
    </button>

    <div v-if="newick">
      <h3>Evolved Sequences:</h3>
      <table class="table-auto w-full text-left" id="evolution-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Sequence</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in sequences" :key="index">
            <td class="font-mono text-lg">
              {{ item.name }}
            </td>
            <td class="break-all">{{ item.sequence }}</td>
          </tr>
        </tbody>
      </table>
      <h3>Newick String:</h3>
      <p>{{ newick }}</p>
      <h3>Built Phylogenetic Tree Visualization:</h3>
      <div>
        <PhyloTree :newick="newick" :width="1200" :show-branch-lengths="true" />
      </div>
    </div>
  </div>
</template>
