<script setup lang="ts">
import { computed } from "vue";

const props = defineProps(["link", "label", "highlighted"]);
const highlightedClass = computed(() =>
  props.highlighted ? "bg-yellow-200/20" : "",
);
</script>

<template>
  <li :class="highlightedClass">
    <a class="a" :href="props.link" target="_blank">{{ props.label }}</a>
  </li>
</template>
