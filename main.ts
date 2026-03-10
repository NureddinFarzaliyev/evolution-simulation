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
  humanCOX1,
  chimpanzeeCOX1,
  donkeyCOX1,
  horseCOX1,
  gorillaCOX1,
  pigCOX1,
  cowCOX1,
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

const hemoglobins: DistanceMatrixEntity[] = [
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

const cox1s: DistanceMatrixEntity[] = [
  {
    name: "Human",
    sequence: humanCOX1,
  },
  {
    name: "Chimpanzee",
    sequence: chimpanzeeCOX1,
  },
  {
    name: "Gorilla",
    sequence: gorillaCOX1,
  },
  {
    name: "Donkey",
    sequence: donkeyCOX1,
  },
  {
    name: "Horse",
    sequence: horseCOX1,
  },
  {
    name: "Cow",
    sequence: cowCOX1,
  },
  {
    name: "Pig",
    sequence: pigCOX1,
  },
];

interface RunParams {
  sequences: DistanceMatrixEntity[];
  gotohParams: GotohParameters;
  labels: string[];
}

function main({ sequences, gotohParams, labels }: RunParams) {
  const distanceMatrix = buildDistanceMatrix(sequences, gotohParams);
  const node = buildNeighborJoining(distanceMatrix, labels);
  const newick = generateNewickString(node);
  console.log(newick);
}

console.log("Hemoglobin:");

main({
  sequences: hemoglobins,
  gotohParams: blosumParams,
  labels: hemoglobins.map((h) => h.name),
});

console.log("COX1:");

main({
  sequences: cox1s,
  gotohParams: blosumParams,
  labels: cox1s.map((h) => h.name),
});

// TODO: console.log("Cytochrome c:");
