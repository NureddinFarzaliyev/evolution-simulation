import { GotohParameters } from "./core/sequenceAlignment/gotohAlgorithm";
import {
  humanHemoglobin,
  chimpanzeeHemoglobin,
  donkeyHemoglobin,
  horseHemoglobin,
} from "./data/proteinSequences";
import BLOSUM62 from "./data/blosum62.json";
import {
  buildDistanceMatrix,
  DistanceMatrixEntity,
} from "./core/phylogeneticTree/phylogeneticTree";

// const pamParams: AlgorithmParameters = {
//   scoringMatrix: PAM250,
//   gapExtend: -2,
//   gapOpen: -12,
//   lambda: 0.191,
//   k: 0.026,
// };

const blosumParams: GotohParameters = {
  scoringMatrix: BLOSUM62,
  gapExtend: -1,
  gapOpen: -11,
  lambda: 0.267,
  k: 0.041,
};

const entities: DistanceMatrixEntity[] = [
  {
    name: "Human",
    sequence: humanHemoglobin,
  },
  {
    name: "Chimpanzee",
    sequence: chimpanzeeHemoglobin,
  },
  {
    name: "Donkey",
    sequence: donkeyHemoglobin,
  },
  {
    name: "Horse",
    sequence: horseHemoglobin,
  },
];

const result = buildDistanceMatrix(entities, blosumParams);
result.forEach((c) => console.log(c));
