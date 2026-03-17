import GAImplementation from "@/pages/GAImplementation.vue";
import GeneticAlgorithms from "@/pages/GeneticAlgorithms.vue";
import Home from "@/pages/Home.vue";
import Sources from "@/pages/Sources.vue";
import { createRouter, createWebHistory } from "vue-router";

const routes = [
  { path: "/", component: Home },
  { path: "/sources", component: Sources },
  { path: "/genetic-algorithms", component: GeneticAlgorithms },
  { path: "/genetic-algorithms-implementation", component: GAImplementation },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
