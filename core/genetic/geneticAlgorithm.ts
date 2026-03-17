import { checkByPercentage, generateRandomInteger } from "../../utils/random";

// Generates a random DNA from a given set of symbols.

type DNA = string;

function generateDNA(dnaSize: number, symbols: string): DNA {
  let newMember = "";
  for (let i = 0; i < dnaSize; i++) {
    const randomIndex = generateRandomInteger(0, symbols.length - 1);
    newMember += symbols[randomIndex];
  }
  return newMember;
}

type Fit = number;

// Finds the fitness of the DNA to the targetDNA based on correct letters and close letters in the string
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
}

interface PopulationMember {
  DNA: DNA;
  fit: Fit;
}

type Population = PopulationMember[];

// Generates a population with random DNAs in given size
function generatePopulation(
  dnaSize: number,
  symbols: string,
  populationSize: number,
  fitness: (DNA: DNA) => Fit,
): Population {
  const population: Population = [];
  for (let i = 0; i < populationSize; i++) {
    const DNA = generateDNA(dnaSize, symbols);
    const fit = fitness(DNA);
    population.push({ DNA, fit });
  }
  return population;
}

// Uses Tournament method by choosing a small group from the population, and finding the most fit in that group
function tournamentSelect(
  population: Population,
  tournamentSize: number,
): PopulationMember {
  let bestDNA = "";
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
}

// Generates new child from given parents
// Uses Uniform Crossover by inheriting a gene randomly from one of the parents.
function generateChildDNA(a: DNA, b: DNA): DNA {
  let childDNA = "";

  for (let i = 0; i < a.length; i++) {
    if (generateRandomInteger(0, 1)) {
      childDNA += a[i];
    } else {
      childDNA += b[i];
    }
  }

  return childDNA;
}

// Mutates a DNA
// Randomly chooses a gene based on mutation rate and changes it to another random one
function mutateChildDNA(DNA: DNA, mutationRate: number, symbols: string) {
  let mutatedDNA = "";

  for (let i = 0; i < DNA.length; i++) {
    if (checkByPercentage(mutationRate * 100)) {
      mutatedDNA += symbols[generateRandomInteger(0, symbols.length - 1)];
    } else {
      mutatedDNA += DNA[i];
    }
  }

  return mutatedDNA;
}

export interface EvolveParams {
  targetDNA: DNA;
  symbols: string;
  populationSize: number;
  mutationRate: number;
  maximumGenerations: number;
}

export function evolve(params: EvolveParams) {
  const {
    maximumGenerations,
    populationSize,
    targetDNA,
    mutationRate,
    symbols,
  } = params;

  // Create random initial population
  let population = generatePopulation(
    targetDNA.length,
    symbols,
    populationSize,
    (DNA) => fitness(DNA, targetDNA),
  );

  // Track global best dna and fitness
  let globalBest: PopulationMember = { DNA: "", fit: -Infinity };

  // Track fitness history to adapt mutation
  let fitnessHistory: Fit[] = [];
  const fitnessHistoryMaxLength = 5;

  // Start evolving over generations
  for (let generation = 0; generation < maximumGenerations; generation++) {
    // Stop if perfect match is found
    if (globalBest.DNA === targetDNA) break;

    // Track generation's best dna and fitness
    let generationBest: PopulationMember = { DNA: "", fit: -Infinity };

    // Evaluate best for each generation
    for (const member of population) {
      // Update best in this generation
      if (member.fit > generationBest.fit) {
        generationBest.fit = member.fit;
        generationBest.DNA = member.DNA;
      }
    }

    // Add generation's best fitness to history
    fitnessHistory.push(generationBest.fit);
    if (fitnessHistory.length > 5) {
      fitnessHistory = fitnessHistory.slice(
        fitnessHistory.length - fitnessHistoryMaxLength,
      );
    }

    // Update globals
    if (generationBest.fit > globalBest.fit) {
      globalBest.fit = generationBest.fit;
      globalBest.DNA = generationBest.DNA;
    }

    console.log(
      ` ${generation} | ${globalBest.DNA} | ${globalBest.fit.toFixed(2)}`,
    );

    const newPopulation: Population = [];

    // Generate child dnas from fittest population using tournament and assign it as new population
    for (let i = 0; i < populationSize - 2; i++) {
      // Select two parents from the population using tournament method
      const parent1 = tournamentSelect(population, 5).DNA;
      const parent2 = tournamentSelect(population, 5).DNA;

      // Generate child based on chosen parents
      const childDNA = generateChildDNA(parent1, parent2);

      // Mutate the child by dynamically adjusting mutation rate based on
      // generation progress and stagnation or very small grow on last 5 generations
      // to allow more exploration in the beginning and more exploitation in the end
      // also considering the minimum mutation rate value.
      const stagnationThreshold = 0.001;
      const isStagnated =
        fitnessHistory.length === fitnessHistoryMaxLength &&
          fitnessHistory[4] - fitnessHistory[0] < stagnationThreshold
          ? 0.01
          : 0;
      const stagnationBonus = isStagnated ? mutationRate * 0.5 : 0;

      const minMutation = mutationRate * 0.1;
      const baseMutation = mutationRate * (1 - generation / maximumGenerations);

      const currentMutationRate =
        Math.max(minMutation, baseMutation) + stagnationBonus;

      const mutatedChildDNA = mutateChildDNA(
        childDNA,
        currentMutationRate,
        symbols,
      );

      const mutatedChildFit = fitness(mutatedChildDNA, targetDNA);

      // Push the child to new population
      newPopulation.push({ DNA: mutatedChildDNA, fit: mutatedChildFit });
    }

    // Elitism - global best and generation best
    newPopulation.push({ ...globalBest });
    newPopulation.push({ ...generationBest });

    // Replace old population for new generation iteration
    population = newPopulation;
  }
}

const evolveParams: EvolveParams = {
  targetDNA: "To be, or not to be, that is the question.",
  // targetDNA: "Hello, world!",
  symbols:
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz,!<>@#$%^&*()_+-=. ",
  mutationRate: 0.01,
  populationSize: 1000,
  maximumGenerations: 10000,
};

evolve(evolveParams);
