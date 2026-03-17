<script setup lang="ts">
import { ChevronRight } from "lucide-vue-next";
import { RouterLink } from "vue-router";

const props = defineProps<{
  url: string;
  title: string;
}>();
</script>

<template>
  <RouterLink :to="url">
    <div
      class="w-full px-10 py-5 mt-10 rounded-lg border-1 border-accent/20 flex items-center bg-bg-secondary flex items-center"
    >
      <h3>{{ props.title }}</h3>
      <ChevronRight class="mt-1.5" />
    </div>
  </RouterLink>
</template>
