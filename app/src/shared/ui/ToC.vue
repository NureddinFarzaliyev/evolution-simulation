<script setup lang="ts">
import { RouterLink } from "vue-router";

const routes = [
  { name: "Home", path: "/" },
  { name: "Genetic Algorithms", path: "/genetic-alghorithms" },
  { name: "Sequence Alignment", path: "/sequence-alignment" },
];
</script>

<template>
  <RouterLink v-for="route in routes" :key="route.path" :to="route.path">
    {{ route.name }}
  </RouterLink>
</template>
