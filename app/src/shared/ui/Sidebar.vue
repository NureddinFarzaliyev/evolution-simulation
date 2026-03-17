<script setup lang="ts">
import ToC from "@/shared/ui/ToC.vue";
import { useSidebar } from "@/stores/sidebarStore";
import classNames from "classnames";
import { CircleXIcon, MenuIcon } from "lucide-vue-next";
import { computed } from "vue";

const sidebar = useSidebar();

const sidebarClass = computed(() =>
  classNames(
    "min-h-screen bg-bg-secondary lg:block w-[85%] lg:w-80 max-lg:absolute top-0 left-0 z-999 max-lg:shadow-[0_0_20px_200px_rgba(0,0,0,.75)] h-dvh overflow-y-auto pb-20 lg:fixed",
    {
      hidden: !sidebar.isOpen,
    },
  ),
);

const buttonClass = computed(() =>
  classNames("lg:hidden absolute top-4 left-4 z-1000 cursor-pointer", {
    hidden: sidebar.isOpen,
  }),
);
</script>

<template>
  <aside>
    <button @click="sidebar.openSidebar" :class="buttonClass">
      <MenuIcon />
    </button>
    <div :class="sidebarClass">
      <button
        @click="sidebar.closeSidebar"
        class="absolute top-4 right-4 lg:hidden cursor-pointer"
      >
        <CircleXIcon />
      </button>
      <div class="px-10 py-2 text-lg">
        <ToC />
      </div>
    </div>
  </aside>
</template>
