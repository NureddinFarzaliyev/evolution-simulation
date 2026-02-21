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

// Finds the fitness of the DNA to the targetDNA based on correct letters in the string
function fitness(DNA: string, targetDNA: string) {
  let fit = 0;
  for (let i = 0; i < DNA.length; i++) {
    if (DNA[i] === targetDNA[i]) fit++;
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

// Creates a new population with fittest members in given size
// Uses Roulette wheel approach by randomly choosing DNAs from weight distributed array based on fitness of the DNA
function chooseFittest(
  population: string[],
  fittestPopulationSize: number,
  fitness: (DNA: string) => number,
) {
  let fitnessValues: { DNA: string; fit: number }[] = [];
  population.forEach((DNA) => fitnessValues.push({ DNA, fit: fitness(DNA) }));
  fitnessValues = fitnessValues.sort((a, b) => b.fit - a.fit);

  const weightArray: { DNA: string; id: number }[] = [];

  fitnessValues.map((item, id) => {
    for (let i = 0; i < item.fit; i++) {
      weightArray.push({ DNA: item.DNA, id });
    }
  });

  const fittestPopulation: string[] = [];

  for (let i = 0; i < fittestPopulationSize; i++) {
    const randomIndex = generateRandomInteger(0, weightArray.length - 1);
    const element = weightArray[randomIndex];
    fittestPopulation.push(element.DNA);
  }

  return fittestPopulation;
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
  const targetFitness = targetDNA.length;

  let done = false;

  let population = generatePopulation(targetFitness, symbols, populationSize);

  for (let i = 0; i < maximumGenerations; i++) {
    if (done) return;

    const newPopulation: string[] = [];

    const fittestPopulation = chooseFittest(
      population,
      fittestPopulationSize,
      (DNA) => fitness(DNA, targetDNA),
    );

    const bestFit = fittestPopulation[0];
    const bestFitFitness = fitness(bestFit, targetDNA);

    console.log(
      `${i} | ${bestFit} | ${((bestFitFitness / targetFitness) * 100).toFixed(2)}%`,
    );
    if (bestFitFitness === targetFitness) {
      done = true;
      break;
    }

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
        fittestPopulation[firstParentIndex],
        fittestPopulation[secondParentIndex],
      );

      const mutatedChildDNA = mutateChildDNA(childDNA, mutationRate, symbols);
      newPopulation.push(mutatedChildDNA);
    }

    newPopulation.push(fittestPopulation[0]);
    newPopulation.push(fittestPopulation[1]);

    population = newPopulation;
  }
}

const evolveParams: EvolveParams = {
  targetDNA: "Hello, World!",
  symbols:
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz,!<>@#$%^&*()_+-= ",
  mutationRate: 0.01,
  populationSize: 1000,
  fittestPopulationSize: 50,
  maximumGenerations: 10000,
};

evolve(evolveParams);
