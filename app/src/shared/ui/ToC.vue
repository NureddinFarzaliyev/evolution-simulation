<script setup lang="ts">
import { RouterLink } from "vue-router";

const routes = [
  { name: "Home", path: "/" },
  { name: "Sources", path: "/sources" },
  { name: "Genetic Algorithms", path: "/genetic-algorithms" },
  { name: "GA Implementation", path: "/genetic-algorithms-implementation" },
  { name: "Sequence Alignment", path: "/sequence-alignment" },
];
</script>

<template>
  <div class="flex flex-col gap-2">
    <h3>Table of Contents</h3>
    <RouterLink v-for="route in routes" :key="route.path" :to="route.path">
      {{ route.name }}
    </RouterLink>
  </div>
</template>
