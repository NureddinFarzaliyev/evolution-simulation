import { GotohParameters } from "./core/sequenceAlignment/gotohAlgorithm";
import {
  humanHemoglobin,
  chimpanzeeHemoglobin,
  donkeyHemoglobin,
  horseHemoglobin,
  gorillaHemoglobin,
  cowHemoglobin,
  pigHemoglobin,
  leopardGeckoHemoglobin,
  carettaHemoglobin,
} from "./data/proteinSequences";
import BLOSUM62 from "./data/blosum62.json";
// import PAM250 from "./data/pam250.json";
import {
  buildDistanceMatrix,
  DistanceMatrixEntity,
} from "./core/phylogeneticTree/distanceMatrix";
import { generateNewickString } from "./core/phylogeneticTree/newick";
import { buildNeighborJoining } from "./core/phylogeneticTree/neighborJoining";

// const pamParams: GotohParameters = {
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
    name: "Gorilla",
    sequence: gorillaHemoglobin,
  },
  {
    name: "Donkey",
    sequence: donkeyHemoglobin,
  },
  {
    name: "Horse",
    sequence: horseHemoglobin,
  },
  {
    name: "Cow",
    sequence: cowHemoglobin,
  },
  {
    name: "Pig",
    sequence: pigHemoglobin,
  },
  {
    name: "Gecko",
    sequence: leopardGeckoHemoglobin,
  },
  {
    name: "Caretta",
    sequence: carettaHemoglobin,
  },
];
const labels = entities.map((e) => e.name);

const distanceMatrix = buildDistanceMatrix(entities, blosumParams);
console.log("DISTANCE MATRIX", distanceMatrix);

const node = buildNeighborJoining(distanceMatrix, labels);
const newick = generateNewickString(node);
console.log(newick);
