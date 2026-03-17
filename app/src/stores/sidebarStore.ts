import { defineStore } from "pinia";
import { ref } from "vue";

export const useSidebar = defineStore("sidebar", () => {
  const isOpen = ref(false);

  const openSidebar = () => {
    isOpen.value = true;
  };

  const closeSidebar = () => {
    isOpen.value = false;
  };

  const toggleSidebar = () => {
    isOpen.value = !isOpen.value;
  };

  return {
    isOpen,
    openSidebar,
    closeSidebar,
    toggleSidebar,
  };
});
