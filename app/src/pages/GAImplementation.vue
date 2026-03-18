<script setup lang="ts">
import { ref } from "vue";
import {
  type UpdateData,
  type EvolveParams,
} from "../../../api/src/core/core/genetic/geneticAlgorithm";
import InputLabelGroup from "@/shared/ui/InputLabelGroup.vue";
import { computed } from "@vue/reactivity";
import LineChart from "@/shared/ui/LineChart.vue";

const data = ref<UpdateData[]>([]);
const reversedData = computed(() => [...data.value].reverse());

const params = ref<EvolveParams>({
  targetDNA: "To be, or not to be, that is the question.",
  symbols:
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz,!<>@#$%^&*()_+-=. ",
  mutationRate: 0.01,
  populationSize: 1000,
  maximumGenerations: 500,
});

const startStreaming = () => {
  data.value = [];

  const paramsToSend: Record<string, string> = {
    targetDNA: params.value.targetDNA,
    symbols: params.value.symbols,
    mutationRate: String(params.value.mutationRate),
    populationSize: String(params.value.populationSize),
    maximumGenerations: String(params.value.maximumGenerations),
  };

  const queryParams = new URLSearchParams(paramsToSend).toString();

  const eventSource = new EventSource(
    `http://localhost:3000/genetic?${queryParams}`,
  );

  eventSource.onmessage = (event) => {
    const res = JSON.parse(event.data);
    data.value.push(res);
  };

  eventSource.onerror = () => {
    eventSource.close();
  };
};

startStreaming();
</script>
<template>
  <h1>Genetic Algorithm Implementation</h1>
  <h3>Configure Parameters</h3>
  <InputLabelGroup
    label="Target DNA"
    v-model="params.targetDNA"
    placeholder="Enter target DNA sequence"
  />
  <InputLabelGroup
    label="Symbols"
    v-model="params.symbols"
    placeholder="Enter symbols to use in DNA"
  />
  <InputLabelGroup
    label="Mutation Rate"
    v-model="params.mutationRate"
    type="number"
    placeholder="Enter mutation rate (e.g., 0.01)"
  />
  <InputLabelGroup
    label="Population Size"
    v-model="params.populationSize"
    type="number"
    placeholder="Enter population size (e.g., 1000)"
  />
  <InputLabelGroup
    label="Maximum Generations"
    v-model="params.maximumGenerations"
    type="number"
    placeholder="Enter maximum generations (e.g., 10000)"
  />
  <button
    class="mt-4 px-4 py-2 bg-accent text-white rounded hover:bg-accent-dark"
    @click="startStreaming"
  >
    Start Evolution
  </button>
  <h3 class="mt-10!">Evolution Progress</h3>
  <table class="table-auto w-full text-left" id="evolution-table">
    <thead>
      <tr>
        <th>Generation</th>
        <th>Best DNA in Generation</th>
        <th>Best Fitness in Generation</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(item, index) in reversedData" :key="index">
        <td>{{ item.generation + 1 }}</td>
        <td class="font-mono text-sm">
          {{ item.bestDNA }}
        </td>
        <td>{{ item.bestFitness.toFixed(4) }}</td>
      </tr>
    </tbody>
  </table>
  <h3 class="mt-10!">Best Fitness Over Generations</h3>
  <LineChart
    :chartData="{
      labels: data.map((item) => `${item.generation + 1}`),
      datasets: [
        {
          label: 'Best Fitness',
          data: data.map((item) => item.bestFitness),
        },
      ],
    }"
  />
</template>
