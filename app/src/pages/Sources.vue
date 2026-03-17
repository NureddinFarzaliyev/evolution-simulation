<script setup lang="ts">
import ResourceItem from "@/shared/ui/ResourceItem.vue";
import { useRoute } from "vue-router";

const sources = [
  {
    link: "https://www.britannica.com/science/evolution-scientific-theory",
    label: "Evolution - Britannica",
  },
  {
    link: "https://evrimagaci.org/evrim-nedir-5509",
    label: "What is Evolution? - Evrim Agaci",
  },
  {
    link: "https://youtu.be/-kpcAa-qKwY",
    label: "Genetic algorithms explained in 6 minutes (...and 28 seconds)",
  },
  {
    link: "https://youtu.be/uQj5UNhCPuo",
    label: "Genetic Algorithms Explained By Example",
  },
  {
    link: "https://youtu.be/nhT56blfRpE",
    label: "Genetic Algorithm from Scratch in Python (tutorial with code)",
  },
  {
    link: "https://www.geeksforgeeks.org/dsa/genetic-algorithms/",
    label: "Genetic Algorithms - GeeksforGeeks (With implementation example)",
  },
  {
    link: "https://youtu.be/QI3aMRu0JPA",
    label: "Genetic Algorithm Example in JavaScript",
  },
  {
    link: "https://youtu.be/RjxwPZcfpAQ",
    label:
      "Genetic Algorithm Tutorial - How to Write Genetic Algorithms in JavaScript",
  },
  {
    link: "https://stats.libretexts.org/Bookshelves/Probability_Theory/Introductory_Probability_(Grinstead_and_Snell)/11%3A_Markov_Chains/11.03%3A_Ergodic_Markov_Chains",
    label: "Ergodic Markov Chains",
  },
];

const route = useRoute();
const higlightedResource = Number(route.query.r);
</script>

<template>
  <h1 class="text-center list-inside">Sources</h1>
  <p>
    It is important to note that some of the paragraphs in the explanations are
    direct excerpts from the resources that are shown in brackets with the
    number of the resource. <b>Stand on the shoulders of giants.</b>
  </p>
  <ol class="list-decimal ml-10">
    <ResourceItem
      v-for="(resource, index) in sources"
      :key="index"
      :link="resource.link"
      :label="resource.label"
      :highlighted="higlightedResource === index + 1"
    />
  </ol>
</template>
