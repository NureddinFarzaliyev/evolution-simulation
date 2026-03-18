<script setup lang="ts">
import { Line } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from "chart.js";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
);

defineProps<{
  chartData: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      borderColor?: string;
    }[];
  };
}>();
</script>

<template>
  <div class="bg-bg-secondary/50 p-5">
    <Line
      :data="{
        labels: chartData.labels,
        datasets: chartData.datasets.map((dataset) => ({
          ...dataset,
          borderColor: 'rgba(200, 169, 107, 0.8)',
          backgroundColor: 'rgba(200, 169, 107, 0.8)',
        })),
      }"
    />
  </div>
</template>
