import BLOSUM62 from "../../data/blosum62.json";

// Generates a random DNA from a given set of symbols.

const AMINO_ACIDS = Object.keys(BLOSUM62).filter((key) => key !== "*");

// Mutates a DNA
// Picks a new amino acid based on BLOSUM62 likelihood
// If a mutation occurs at 'currentAA', we look at all possible
// replacements and pick one where higher BLOSUM scores have higher odds.

function getBiologicalMutation(currentAA: string): string {
  const scores = BLOSUM62[currentAA];

  // pool of candidates
  const candidates = AMINO_ACIDS.filter((aa) => aa !== currentAA);

  // Calculate weights. BLOSUM scores are log-odds, so we use
  // Math.exp or a simpler power function to make them positive weights.
  const weights = candidates.map((aa) => {
    const score = scores[aa] ?? -4; // -4 is a default low score for unkown pairs
    return Math.pow(2, score); // Convert log-score back to relative
  });

  // Weighted random selection among candidates
  const totalWeight = weights.reduce((sum, w) => sum + w, 0);
  let randomThreshold = Math.random() * totalWeight;

  for (let i = 0; i < candidates.length; i++) {
    randomThreshold -= weights[i];
    if (randomThreshold <= 0) {
      return candidates[i];
    }
  }

  return candidates[0];
}

function mutateChildDNA(sequence: string, mutationRate: number) {
  let mutatedDNA = "";

  for (let i = 0; i < sequence.length; i++) {
    const currentAA = sequence[i];
    if (Math.random() < mutationRate) {
      mutatedDNA += getBiologicalMutation(currentAA);
    } else {
      mutatedDNA += currentAA;
    }
  }

  return mutatedDNA;
}

function simulateBranchDrift(
  sequence: string,
  generations: number,
  mutationRate: number,
): string {
  let evolvedSequence = sequence;

  for (let i = 0; i < generations; i++) {
    evolvedSequence = mutateChildDNA(evolvedSequence, mutationRate);
  }

  return evolvedSequence;
}

interface SpeciationResult {
  branchA: string;
  branchB: string;
}

// Speciation: Takes an ancestral sequence and splits it into two independent lines.
function speciate(ancestor: string): SpeciationResult {
  // clone the ancestor.
  // Evolution is what happens AFTER this split.
  return {
    branchA: ancestor, // Path 1
    branchB: ancestor, // Path 2
  };
}

interface SimulationLeaf {
  name: string;
  sequence: string;
}

interface SimulateEvolutionParams {
  seed: string;
  mutationRate: number;
  depth: number;
  mutationsPerBranch: number;
  name?: string;
}

// Recursive tree generation
export function simulateEvolution(
  params: SimulateEvolutionParams,
): SimulationLeaf[] {
  const { seed, mutationRate, depth, mutationsPerBranch, name = "" } = params;

  const evolvedSeed = simulateBranchDrift(
    seed,
    mutationsPerBranch,
    mutationRate,
  );

  // If base, return this species
  if (depth === 0) {
    return [{ name, sequence: evolvedSeed }];
  }

  // Recursive speciate
  const { branchA, branchB } = speciate(evolvedSeed);

  // Continue evolving
  const leftLineage = simulateEvolution({
    seed: branchA,
    depth: depth - 1,
    mutationsPerBranch,
    mutationRate,
    name: name + "L",
  });
  const rightLineage = simulateEvolution({
    seed: branchB,
    depth: depth - 1,
    mutationsPerBranch,
    mutationRate,
    name: name + "R",
  });

  // Combine and return all modern species found in the sub-branches
  return [...leftLineage, ...rightLineage];
}
