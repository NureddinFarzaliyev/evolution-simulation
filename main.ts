import { GotohParameters } from "./core/sequenceAlignment/gotohAlgorithm";
import {
  humanHemoglobin,
  chimpanzeeHemoglobin,
  donkeyHemoglobin,
  horseHemoglobin,
} from "./data/proteinSequences";
import BLOSUM62 from "./data/blosum62.json";
import { buildUPGMA } from "./core/phylogeneticTree/UPGMA";
import {
  buildDistanceMatrix,
  DistanceMatrixEntity,
} from "./core/phylogeneticTree/distanceMatrix";

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

const distanceMatrix = buildDistanceMatrix(entities, blosumParams);
distanceMatrix.forEach((c) => console.log(c));

const node = buildUPGMA(
  distanceMatrix,
  entities.map((e) => e.name),
);
console.dir(node, { depth: null });
