import GAImplementation from "@/pages/GAImplementation.vue";
import GeneticAlgorithms from "@/pages/GeneticAlgorithms.vue";
import Home from "@/pages/Home.vue";
import SequenceAlignment from "@/pages/SequenceAlignment.vue";
import SequenceAlignmentImplementation from "@/pages/SequenceAlignmentImplementation.vue";
import Simulation from "@/pages/Simulation.vue";
import SimulationImplementation from "@/pages/SimulationImplementation.vue";
import Sources from "@/pages/Sources.vue";
import { createRouter, createWebHistory } from "vue-router";

const routes = [
  { path: "/", component: Home },
  { path: "/sources", component: Sources },
  { path: "/genetic-algorithms", component: GeneticAlgorithms },
  { path: "/genetic-algorithms-implementation", component: GAImplementation },
  { path: "/sequence-alignment", component: SequenceAlignment },
  {
    path: "/sequence-alignment-implementation",
    component: SequenceAlignmentImplementation,
  },
  {
    path: "/simulation",
    component: Simulation,
  },
  {
    path: "/simulation-implementation",
    component: SimulationImplementation,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
