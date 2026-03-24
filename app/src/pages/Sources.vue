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
  {
    link: "https://content.ucpress.edu/chapters/10874.ch01.pdf",
    label: "Sequence Alignment - Michael S. Rosenberg",
  },
  {
    link: "https://youtu.be/MiqoA-yF-0M",
    label:
      "Edit Distance Between 2 Strings - The Levenshtein Distance ('Edit Distance' on LeetCode)",
  },
  {
    link: "https://en.wikipedia.org/wiki/Sequence_alignment",
    label: "Sequence alignment - Wikipedia",
  },
  {
    link: "https://isu-molphyl.github.io/EEOB563/chapter3.pdf",
    label: "The Phylogenetic Handbook",
  },
  {
    link: "https://www.genome.jp/tools-bin/clustalw",
    label:
      "ClustalW - Multiple Sequence Alignment by Kyoto University Bioinformatics Center",
  },
  {
    link: "https://content.ucpress.edu/chapters/10874.ch01.pdf",
    label: "Sequence Alignment - Michael S. Rosenberg",
  },
  {
    link: "https://youtu.be/njva17LwhsE",
    label: "BLAST 5 BLOSUM62 - Rob Edwards",
  },
  {
    link: "https://bioinformaticshome.com/learn/tutorials/sequence-alignment/substitution-matrices#gsc.tab=0",
    label: "Construction of Substitution Matrices: Part 1 - BLOSUM",
  },
  {
    link: "https://en.wikipedia.org/wiki/BLOSUM",
    label: "BLOSUM - Wikipedia",
  },
  {
    link: "https://gist.github.com/camillescott/403d2229d25ce30c94c3",
    label: "BLOSUM62 in JSON format",
  },
  {
    link: "https://www.uniprot.org/",
    label: "UniProt",
  },
  {
    link: "https://youtu.be/DQQ_q2dn2ds",
    label:
      "Week 2.2.2 Alignment with Affine Gap Penalty and Calculation of Time Complexity of The Needleman Wun",
  },
  {
    link: "https://youtu.be/VzR5wyf5sD0",
    label: "1: Introduction to Gotoh's Alignment Algorithm",
  },
  {
    link: "https://youtu.be/tTRR-nZLR6I",
    label: "2: Memoization in Gotoh's Algorithm",
  },
  {
    link: "https://www.biogem.org/downloads/notes/kau/PAM%20and%20BLOSUM%20Matrices.pdf",
    label: "PAM and BLOSUM Matrices",
  },
  {
    link: "https://genomicsaotearoa.github.io/hts_workshop_mpi/level1/43_blast_interpretation/#interpretting-the-results-of-blast-queries",
    label: "4.3 - Interpreting BLAST results - E-Value and Bit Score",
  },
  {
    label:
      "Evrimde Türler Arası Benzerlikler ve Köken İlişkisi: Homoloji Nedir? Homoplazi Nedir?",
    link: "https://evrimagaci.org/evrimde-turler-arasi-benzerlikler-ve-koken-iliskisi-homoloji-nedir-homoplazi-nedir-1973",
  },
  {
    link: "https://evrimagaci.org/evrim-agaclarinin-filogenetik-haritalarin-ozu-canlilik-tarihini-haritalamanin-bilimi-3175",
    label:
      "Evrim Ağaçlarının (Filogenetik Haritaların) Özü: Canlılık Tarihini Haritalamanın Bilimi",
  },
  {
    link: "https://en.wikipedia.org/wiki/Phylogenetic_tree",
    label: "Phylogenetic Tree - Wikipedia",
  },
  {
    link: "https://en.wikipedia.org/wiki/Newick_format",
    label: "Newick Format - Wikipedia",
  },
  {
    link: "https://www.sciencefacts.net/phylogenetic-tree.html",
    label: "Phylogenetic Tree - Sciencefacts",
  },
  {
    link: "https://bioprinciples.biosci.gatech.edu/module-1-evolution/phylogenetic-trees/",
    label: "Phylogenetic Trees - Biological Principles",
  },
  {
    link: "https://www.megasoftware.net/mega1_manual/Distance.html",
    label: "Distance Estimation - MEGA Manual",
  },
  {
    link: "https://en.wikipedia.org/wiki/Substitution_model",
    label: "Substitution Models - Wikipedia",
  },
  {
    link: "https://etetoolkit.org/treeview/",
    label: "ETE Toolkit Phylogenetic Tree Viewer",
  },
  {
    link: "https://cs.brown.edu/courses/csci1810/fall-2024/lectures/Phylogeny.pdf",
    label: "Distance Algorithms: UPGMA and Neighbor-Joining",
  },
  {
    link: "https://en.wikipedia.org/wiki/UPGMA",
    label: "UPGMA - Wikipedia",
  },
  {
    link: "https://youtu.be/09eD4A_HxVQ",
    label: "Creating a Phylogenetic Tree - Oxford Academic",
  },
  {
    link: "https://timetree.org/",
    label: "Time Tree",
  },
  {
    link: "https://youtu.be/Y0QWFFWQzds",
    label: "The Neighbor-Joining Algorithm",
  },
  {
    link: "https://cdn.britannica.com/03/403-050-F1B9349F/Phylogeny-differences-cytochrome-c-protein-sequence-organisms.jpg",
    label:
      "Phylogeny based on differences in the protein sequence of cytochrome c.",
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
