<script setup>
import { defineProps } from "vue";
const { number } = defineProps(["number"]);
</script>

<template>
  <a class="a -ml-1 mr-1" :href="`/sources?r=${number}`" target="_blank"
    >[{{ number }}]</a
  >
</template>
