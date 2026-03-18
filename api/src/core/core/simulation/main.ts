import BLOSUM62 from "../../data/blosum62.json";
import { generateNewickFromEntities } from "../phylogeneticTree/generateNewickFromEntities";
import { humanCOX1 } from "../../data/proteinSequences";
import { simulateEvolution } from "./simulateEvolution";

function main() {
  const simulationResults = simulateEvolution({
    seed: humanCOX1 + humanCOX1,
    depth: 3,
    mutationsPerBranch: 80,
    mutationRate: 0.003,
  });

  const blosumParams = {
    scoringMatrix: BLOSUM62,
    gapOpen: -11,
    gapExtend: -1,
    lambda: 0.3176,
    k: 0.134,
  };

  const generatedNewick = generateNewickFromEntities({
    sequences: simulationResults,
    gotohParams: blosumParams,
    labels: simulationResults.map((e) => e.name),
  });

  console.log(generatedNewick);
}

main();
