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

// Creates a new evaluated population array with fittest members in given size using tournament selection
function sortTournament(
  population: string[],
  fittestPopulationSize: number,
  fitness: (DNA: string) => number,
  tournamentSize: number = 5,
) {
  const resultPopulation: { DNA: string; fit: number }[] = [];

  for (let i = 0; i < fittestPopulationSize; i++) {
    resultPopulation.push(
      tournamentSelect(population, fitness, tournamentSize),
    );
  }

  return resultPopulation.sort((a, b) => b.fit - a.fit);
}

// Generates new child from given parents
// Uses Davis Order Crossover by inheriting random section from a parent and remaining indexes from the other one
function generateChildDNA(a: string, b: string) {
  const firstCrossoverPoint = generateRandomInteger(0, a.length - 2);
  const secondCrossoverPoint = generateRandomInteger(
    firstCrossoverPoint + 1,
    a.length - 1,
  );

  const firstParentSection = a.slice(
    firstCrossoverPoint,
    secondCrossoverPoint + 1,
  );

  const secondParentSection1 = b.slice(0, firstCrossoverPoint);
  const secondParentSection2 = b.slice(secondCrossoverPoint + 1);

  let childDNA =
    secondParentSection1 + firstParentSection + secondParentSection2;

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
  fittestPopulationSize: number;
  mutationRate: number;
  maximumGenerations: number;
}

function evolve(params: EvolveParams) {
  const {
    maximumGenerations,
    fittestPopulationSize,
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

  // Start evolving over generations
  for (let generation = 0; generation < maximumGenerations; generation++) {
    if (globalBestDNA === targetDNA) break;

    // build fittest population by using Tournament Selection
    const fittestPopulation = sortTournament(
      population,
      fittestPopulationSize,
      (DNA) => fitness(DNA, targetDNA),
      5,
    );

    const bestOfGeneration = fittestPopulation[0];

    // Update globals
    if (bestOfGeneration.fit > globalBestFitness) {
      globalBestFitness = bestOfGeneration.fit;
      globalBestDNA = bestOfGeneration.DNA;
    }

    console.log(
      `${generation} | ${globalBestDNA} | ${globalBestFitness.toFixed(2)}`,
    );

    const newPopulation: string[] = [];

    // Generate child dnas from fittest population and assign it as new population
    for (let j = 0; j < populationSize - 2; j++) {
      const firstParentIndex = generateRandomInteger(
        0,
        fittestPopulationSize - 1,
      );
      const secondParentIndex = generateRandomInteger(
        0,
        fittestPopulationSize - 1,
        [firstParentIndex],
      );

      const childDNA = generateChildDNA(
        fittestPopulation[firstParentIndex].DNA,
        fittestPopulation[secondParentIndex].DNA,
      );

      const mutatedChildDNA = mutateChildDNA(childDNA, mutationRate, symbols);
      newPopulation.push(mutatedChildDNA);
    }

    // Elitism - preserve top 2
    newPopulation.push(fittestPopulation[0].DNA);
    newPopulation.push(fittestPopulation[1].DNA);

    population = newPopulation;
  }
}

const evolveParams: EvolveParams = {
  // targetDNA: "The quick brown fox jumps over the lazy dog",
  targetDNA: "Hello, world!",
  symbols:
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz,!<>@#$%^&*()_+-= ",
  mutationRate: 0.02,
  populationSize: 1000,
  fittestPopulationSize: 50,
  maximumGenerations: 10000,
};

evolve(evolveParams);
