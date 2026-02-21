import { checkByPercentage, generateRandomInteger } from "./utils/random";

// Generates a random DNA from a given set of symbols.
function generateDNA(dnaSize: number, symbols: string) {
  let newMember = "";
  for (let i = 0; i < dnaSize; i++) {
    const randomIndex = generateRandomInteger(0, symbols.length - 1);
    newMember += symbols[randomIndex];
  }
  return newMember;
}

// Finds the fitness of the DNA to the targetDNA based on correct letters and close letters in the string
function fitness(DNA: string, targetDNA: string) {
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

// Generates a population with random DNAs in given size
function generatePopulation(
  dnaSize: number,
  symbols: string,
  populationSize: number,
) {
  const population: string[] = [];
  for (let i = 0; i < populationSize; i++) {
    population.push(generateDNA(dnaSize, symbols));
  }
  return population;
}

// Uses Tournament method by choosing a small group from the population, and finding the most fit in that group
function tournamentSelect(
  population: string[],
  fitnessFn: (DNA: string) => number,
  tournamentSize: number,
) {
  let bestDNA = "";
  let bestFitness = -Infinity;

  for (let i = 0; i < tournamentSize; i++) {
    const candidate =
      population[generateRandomInteger(0, population.length - 1)];

    const candidateFitness = fitnessFn(candidate);

    if (candidateFitness > bestFitness) {
      bestFitness = candidateFitness;
      bestDNA = candidate;
    }
  }

  return { DNA: bestDNA!, fit: bestFitness };
}

// Generates new child from given parents
// Uses Uniform Crossover by inheriting a gene randomly from one of the parents.
function generateChildDNA(a: string, b: string) {
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
function mutateChildDNA(DNA: string, mutationRate: number, symbols: string) {
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

interface EvolveParams {
  targetDNA: string;
  symbols: string;
  populationSize: number;
  mutationRate: number;
  maximumGenerations: number;
}

function evolve(params: EvolveParams) {
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
  );

  // Track global best dna and fitness
  let globalBestDNA = "";
  let globalBestFitness = -Infinity;

  // Track fitness history to adapt mutation
  let fitnessHistory: number[] = [];
  const fitnessHistoryMaxLength = 5;

  // Start evolving over generations
  for (let generation = 0; generation < maximumGenerations; generation++) {
    // Stop if perfect match is found
    if (globalBestDNA === targetDNA) break;

    // Track generation's best dna and fitness
    let generationBestDNA = "";
    let generationBestFitness = -Infinity;

    // Evaluate best for each generation
    for (const DNA of population) {
      const fit = fitness(DNA, targetDNA);

      // Update best in this generation
      if (fit > generationBestFitness) {
        generationBestFitness = fit;
        generationBestDNA = DNA;
      }
    }

    // Add generation's best fitness to history
    fitnessHistory.push(generationBestFitness);
    if (fitnessHistory.length > 5) {
      fitnessHistory = fitnessHistory.slice(
        fitnessHistory.length - fitnessHistoryMaxLength,
      );
    }

    // Update globals
    if (generationBestFitness > globalBestFitness) {
      globalBestFitness = generationBestFitness;
      globalBestDNA = generationBestDNA;
    }

    console.log(
      ` ${generation} | ${globalBestDNA} | ${globalBestFitness.toFixed(2)}`,
    );

    const newPopulation: string[] = [];

    // Generate child dnas from fittest population using tournament and assign it as new population
    for (let i = 0; i < populationSize - 2; i++) {
      // Select two parents from the population using tournament method
      const parent1 = tournamentSelect(
        population,
        (DNA) => fitness(DNA, targetDNA),
        5,
      ).DNA;
      const parent2 = tournamentSelect(
        population,
        (DNA) => fitness(DNA, targetDNA),
        5,
      ).DNA;

      // Generate child based on chosen parents
      const childDNA = generateChildDNA(parent1, parent2);

      // Mutate the child by dynamically adjusting mutation rate based on
      // generation progress and stagnation or very small grow on last 5 generations
      // to allow more exploration in the beginning and more exploitation in the end
      const stagnationThreshold = 0.001;
      const isStagnated =
        fitnessHistory.length === fitnessHistoryMaxLength &&
          fitnessHistory[4] - fitnessHistory[0] < stagnationThreshold
          ? 0.01
          : 0;

      const stagnationBonus = isStagnated ? mutationRate * 0.5 : 0;
      const currentMutationRate =
        mutationRate * (1 - generation / maximumGenerations) + stagnationBonus;
      const mutatedChildDNA = mutateChildDNA(
        childDNA,
        currentMutationRate,
        symbols,
      );

      // Push the child to new population
      newPopulation.push(mutatedChildDNA);
    }

    // Elitism - global best and generation best
    newPopulation.push(globalBestDNA);
    newPopulation.push(generationBestDNA);

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
