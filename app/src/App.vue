<script setup lang="ts">
import Header from "@/shared/ui/Header.vue";
import { RouterView } from "vue-router";
</script>

<template>
  <div className="min-h-screen bg-bg-primary text-text-primary font-primary">
    <Header />
    <div class="p-4 lg:px-10">
      <RouterView />
    </div>
  </div>
</template>

<style>
@import url("https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300..700;1,300..700&display=swap");
@import "tailwindcss";

@theme {
  --color-bg-primary: #0f0d12;
  --color-bg-secondary: #18151d;
  --color-text-primary: #f3eee6;
  --color-text-secondary: #b8aea3;
  --color-accent: #c8a96b;
  --font-primary: "Cormorant Garamond", serif;
}

@utility header-text {
  @apply text-sm lg:text-base font-medium text-text-secondary text-center;
}

@utility h1 {
  @apply text-2xl lg:text-4xl font-bold my-6 lg:mb-10 max-w-4xl mx-auto;
}

h1 {
  @apply h1;
}

@utility h3 {
  @apply text-xl lg:text-2xl font-semibold my-4;
}

h3 {
  @apply h3;
}

@utility p {
  @apply text-base lg:text-lg mb-4 text-justify text-text-primary;
}

p {
  @apply p;
}

@utility a {
  @apply text-text-primary hover:text-accent underline;
}

a {
  @apply a;
}

@utility ul {
  @apply list-inside text-text-primary text-base lg:text-lg mb-4;
}

ul {
  @apply ul;
}

@utility ol {
  @apply list-decimal list-inside text-text-primary text-base lg:text-lg mb-4;
}

ol {
  @apply ol;
}
</style>
