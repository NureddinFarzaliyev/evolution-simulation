<script setup lang="ts">
import Header from "@/shared/ui/Header.vue";
import Sidebar from "@/shared/ui/Sidebar.vue";
import { useSidebar } from "@/stores/sidebarStore";
import classNames from "classnames";
import { computed } from "vue";
import { RouterView } from "vue-router";

const sidebar = useSidebar();

const layoutClass = computed(() =>
  classNames("flex-1 lg:ml-80", {
    "max-lg:max-h-dvh max-lg:overflow-hidden": sidebar.isOpen,
  }),
);
</script>

<template>
  <div
    className="min-h-screen bg-bg-primary text-text-primary font-primary flex"
  >
    <Sidebar />
    <div :class="layoutClass">
      <Header />
      <main class="px-6 pb-20 bg-bg-primary">
        <RouterView />
      </main>
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
  @apply text-2xl lg:text-4xl font-bold my-6 lg:mb-10 max-w-4xl mx-auto text-center;
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

@utility td {
  @apply border border-bg-secondary px-4 py-2 text-text-primary;
}

td {
  @apply td;
}

@utility th {
  @apply border border-bg-secondary px-4 py-2 text-text-primary bg-bg-secondary;
}

th {
  @apply th;
}

@utility input {
  @apply bg-bg-secondary text-text-primary border border-bg-secondary rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent text-base lg:text-lg;
}

input {
  @apply input;
}

@utility label {
  @apply text-base lg:text-lg text-text-primary mb-1;
}

label {
  @apply label;
}

@utility button {
  @apply bg-accent text-bg-primary font-medium rounded px-4 py-2 hover:bg-accent/90 focus:outline-none focus:ring-2 focus:ring-accent text-base lg:text-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-accent;
}

button {
  @apply button;
}
</style>
