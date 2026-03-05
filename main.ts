import {
  AlgorithmParameters,
  gotoh,
} from "./core/sequenceAlignment/gotohAlgorithm";
import { humanHemoglobin, chimpanzeeHemoglobin } from "./data/proteinSequences";
import BLOSUM62 from "./data/blosum62.json";
import { getEvolutionaryDistance } from "./core/phylogeneticTree/phylogeneticTree";

// const pamParams: AlgorithmParameters = {
//   scoringMatrix: PAM250,
//   gapExtend: -2,
//   gapOpen: -12,
//   lambda: 0.191,
//   k: 0.026,
// };

const blosumParams: AlgorithmParameters = {
  scoringMatrix: BLOSUM62,
  gapExtend: -1,
  gapOpen: -11,
  lambda: 0.267,
  k: 0.041,
};

const gotohResult = gotoh(humanHemoglobin, chimpanzeeHemoglobin, blosumParams);
const distance = getEvolutionaryDistance(
  gotohResult.alignedA,
  gotohResult.alignedB,
);
console.log(distance);
