<script setup lang="ts">
import CodeBlock from "@/shared/ui/CodeBlock.vue";
import NextChapterBlock from "@/shared/ui/NextChapterBlock.vue";
import ResourceIndicator from "@/shared/ui/ResourceIndicator.vue";
</script>

<template>
  <div>
    <h1>Genetic Algorithms</h1>
    <h3>Introduction</h3>
    <p>
      Knapsack problem: Let's say you have to carry certain items with you in a
      trip with the help of a knapsack. However, it has a limited capability and
      all of the items cannot fit in it. You cannot just weigh every combination
      of them to decide which items you should include in your bag in the most
      favorable way. It may be possible to solve this problem with a brute-force
      approach, but it would be very inefficient and time-consuming, especially
      as the number of items increases. This is where Genetic Algorithms come
      into play.
      <ResourceIndicator number="4" />
      <ResourceIndicator number="5" />
    </p>

    <p>
      Initially, we can choose a random combination of items to put into our
      knapsack. However, instead of choosing one random combination, let's
      choose a hundred of them and create a population of candidate solutions.
      Then, we should evaluate the fitness of each solution, which is determined
      by the degree of favorableness. This fitness may differ based on the
      problem. In our case, usefulness value of the item can be considered as
      the fitness. After evaluating each of the solutions in our first
      population, we can easily select the best ones. However, even the best
      ones may be very far from our most optimal solution. So, what we have to
      do is to create a new generation of solutions from the best ones. We can
      do this by applying genetic operators such as selection, crossover and
      mutation which is going to be discussed later. After applying this
      operators, we are going to have a new generation of solution. Then, we can
      repeat the process on this new generation, until we get a solution that is
      good enough. This iterative process of evolving the population of
      solutions is what makes Genetic Algorithms powerful and efficient in
      finding optimal or near-optimal solutions to complex problems.
    </p>

    <p>
      More formally, a Genetic Algorithm (GA) is a population-based evolutionary
      optimization technique inspired by the principles of natural selection and
      genetics. It works by iteratively evolving a population of candidate
      solutions using biologically motivated operators such as selection,
      crossover and mutation to find optimal or near-optimal solutions to
      complex problems where traditional optimization techniques are
      ineffective. Genetic Algorithms use the survival of the fittest algorithm
      to reach the solution much faster than randomly guessing and makes it
      possible to solve otherwise almost impossible to solve questions.
      <ResourceIndicator number="6" />
    </p>

    <p>
      Now, we are going to implement a Genetic Algorithm. The goal of this
      algorithm will be to guess a certain string from a combination of
      predefined characters in the alphabet. First of all, let's define the
      steps which we should implement:
    </p>
    <ul class="list-decimal list-inside">
      <li>Create Initial Population with DNA Encoding</li>
      <li>Define a Fitness Function</li>
      <li>Selection of Fittest Individuals</li>
      <li>Crossover to Generate Next Generation</li>
      <li>Mutation to Maintain Genetic Diversity</li>
      <li>Repeat the Process Until Convergence</li>
    </ul>

    <h3>Create Initial Population with DNA Encoding</h3>
    <p>
      In first step, we should create an initial population with population size
      of n, and assign a DNA to them. DNA is a collection of Genes. For example,
      let's say we have a simple path finding function with options of left,
      right, up and down. Then, these four directions are genes. For each
      population member, we should create a random sequence of these
      instructions. This instruction set is called DNA.
    </p>
    <p>
      The DNA is an encoded version of the solution and attempts. There are
      certain methods to acquire a DNA encoding: <br />
      a) Binary Encoding uses binary strings<br />
      b) Real-Valued Encoding uses real numbers <br />
      c) Permutation Encoding uses ordered sequences as DNA.
    </p>
    <p>
      In our algorithm which is going to guess a certain string, our alphabet of
      solutions, or DNA pool is going to be:
    </p>
    <CodeBlock
      code="const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz,!<>@#$%^&*()_+-=. '"
    />
    <p>
      Then, we can use a simple snippet to get a random string from this
      alphabet to create the initial random DNA. Then, repeat this process n
      times to create a population of n random DNA strings.
    </p>

    <h3>Define a Fitness Function</h3>
    <p>
      Fitness function is a function which decides if the result of a certain
      DNA is fit for our solution or not. In path finding case, we can define
      this function by the distance between the arrived point and desired exit.
      So, if the result of DNA is closer to the exit, it is more fit.
    </p>
    <p>
      In our case, fitness of the single gene in the DNA can be measured by its
      distance to the perfect match. So, our fitness function can be written as:
    </p>
    <CodeBlock
      code="// Finds the fitness of the DNA to the targetDNA based on correct letters and close letters in the string
function fitness(DNA: DNA, targetDNA: DNA): Fit {
  let fit = 0;
  for (let i = 0; i < DNA.length; i++) {
    const diff = Math.abs(DNA.charCodeAt(i) - targetDNA.charCodeAt(i));

    // Exact match bonus
    if (diff === 0) {
      fit += 5;
    }

    // Closeness reward
    fit += 1 / (1 + diff);
  }
  return fit;
}"
    />

    <h3>Selection of Fittest Individuals</h3>
    <p>
      The goal of selection is to give preference to fitter individuals while
      still maintaining population diversity. <br />
      a) <b>Roulette Wheel Selection:</b> each individual’s probability of being
      selected is directly proportional to its fitness value. <br />
      b) <b>Tournament Selection:</b> It randomly selects a small random group
      of individuals from the population and chooses the fittest among them as a
      parent. This process is repeated until the required number of parents is
      selected. Compared to trunction selection, it has a slightly less
      evolutionary pressure which makes it possible to the worst-fit elements to
      be choosen once in a while. <br />c)
      <b>Stochastic Universal Sampling (SUS Selection):</b> It is an improved
      version of fitness-proportionate selection designed to reduce the
      randomness and sampling bias present in standard roulette wheel selection.
      Instead of using a single random pointer, SUS uses multiple equally spaced
      pointers to select individuals from the population. <br />d)<b>
        Truncation Selection:
      </b>
      without any randomness, just choose the K best fit items. This drastically
      improves the selection pressure by making sure that lower-fit elements are
      never chosen. While choosing with this method it is best to keep the
      fittest population size 5-20% of the generations.
    </p>
    <p>In our example, we are going to implement tournament selection.</p>
    <CodeBlock
      code="function tournamentSelect(
  population: Population,
  tournamentSize: number,
): PopulationMember {
  let bestDNA = '';
  let bestFitness = -Infinity;

  for (let i = 0; i < tournamentSize; i++) {
    const candidate =
      population[generateRandomInteger(0, population.length - 1)];

    const candidateFitness = candidate.fit;

    if (candidateFitness > bestFitness) {
      bestFitness = candidateFitness;
      bestDNA = candidate.DNA;
    }
  }

  return { DNA: bestDNA!, fit: bestFitness };
}"
    />

    <h3>Crossover to Generate Next Generation</h3>
    <p>
      In order to create a new population, we should breed our fittest members
      to produce children. In order to do this, we should take DNAs from parents
      and combine them to create a child. This combination can be derived by
      various methods. For example, we can split the DNA into smaller sections,
      then randomly choose sections from one of two parents. We can also include
      some number of best fit members of our previous population into new one
      too. Crossover methods: <br />
      a) One Point Crossover: A random Point is chosen to be The CrossOver Point
      , then we fill the child with genes from both parents. <br />b) Multi
      Point Crossover: A random two Points are chosen to be The CrossOver Points
      , then we fill the child with genes from both parents. <br />c) Davis
      Order Crossover (OX1): We Choose two random crossover points in the first
      parent and we copy that segment into the Child, then we fill the rest of
      genes in our child with the genes from the second Parent. <br />d) Uniform
      CrossOver: We flip a coin for each genes in our two parents to decide
      whether or not it’ll be included in the off-spring (Child ).
    </p>
    <p>In our example, we are going to implement Uniform Crossover method.</p>
    <CodeBlock
      code="
      function generateChildDNA(a: DNA, b: DNA): DNA {
  let childDNA = '';

  for (let i = 0; i < a.length; i++) {
    if (generateRandomInteger(0, 1)) {
      childDNA += a[i];
    } else {
      childDNA += b[i];
    }
  }

  return childDNA;
}
      "
    />

    <h3>Mutation to Maintain Genetic Diversity</h3>
    <p>
      After this, we should create some mutaions to be able to have variety in
      the population. This prevents the cases which a certain gene may not exist
      at all in the initial population causing it to "extinct". We should choose
      a mutation rate which shows how much the child differs from its parents.
      Mutation methods: <br />
      a) Bit flip Mutation: We select one or more random points (Bits) and flip
      them. This is used for binary encoded Genetic Algorithms. <br />b) Swap
      Mutation: We Choose two Point and we switch them. <br />c) Scramble
      Mutation: We choose a random segment in The Current Chromosome and we
      interchange the values. <br />d) Inversion Mutation: We choose a random
      segment in The Current Chromosome and we reverse The Order of the values.
    </p>
    <p>
      In the example, we are going to implement simple mutation function which
      randomly changes a gene in the DNA with a certain mutation rate.
    </p>
    <CodeBlock
      code="function mutateChildDNA(DNA: DNA, mutationRate: number, symbols: string) {
  let mutatedDNA = '';

  for (let i = 0; i < DNA.length; i++) {
    if (checkByPercentage(mutationRate * 100)) {
      mutatedDNA += symbols[generateRandomInteger(0, symbols.length - 1)];
    } else {
      mutatedDNA += DNA[i];
    }
  }

  return mutatedDNA;
}"
    />

    <h3>Repeat the Process Until Convergence</h3>
    <p>
      These steps should be repeated until we get a solution that is good
      enough. Moreover, extra variables like maximum number of generations or a
      certain fitness threshold can be defined to stop the process.
    </p>

    <NextChapterBlock
      url="/genetic-algorithms-implementation"
      title="Implementation of Genetic Algorithm"
    />
  </div>
</template>
