import { Request, Response, Router } from "express";
import { humanCOX1 } from "../core/data/proteinSequences";
import {
  simulateEvolution,
  SimulateEvolutionParams,
} from "../core/core/simulation/simulateEvolution";
import {
  generateNewickFromEntities,
  RunParams,
} from "../core/core/phylogeneticTree/generateNewickFromEntities";
import BLOSUM62 from "../core/data/blosum62.json";
import Joi from "joi";

export const simulationRouter = Router();

const siumulationDefaults: SimulateEvolutionParams = {
  seed: humanCOX1 + humanCOX1,
  depth: 3,
  mutationsPerBranch: 80,
  mutationRate: 0.003,
};

const blosumParams = {
  scoringMatrix: BLOSUM62,
  gapOpen: -11,
  gapExtend: -1,
  lambda: 0.3176,
  k: 0.134,
};

const simulationSchema = Joi.object<SimulateEvolutionParams>({
  seed: Joi.string().max(10000).default(siumulationDefaults.seed),
  depth: Joi.number()
    .integer()
    .min(1)
    .max(10)
    .default(siumulationDefaults.depth),
  mutationsPerBranch: Joi.number()
    .integer()
    .min(1)
    .max(1000)
    .default(siumulationDefaults.mutationsPerBranch),
  mutationRate: Joi.number()
    .min(0)
    .max(1)
    .default(siumulationDefaults.mutationRate),
});

simulationRouter.get("/", async (req: Request, res: Response) => {
  const query = req.query;
  const { error, value } = simulationSchema.validate(query);

  if (error) {
    res.status(400).json({ error: error.details[0].message });
    return;
  }

  const simulationResults = simulateEvolution(value);

  const newickParams: RunParams = {
    sequences: simulationResults,
    gotohParams: blosumParams,
    labels: simulationResults.map((e) => e.name),
  };

  const generatedNewick = generateNewickFromEntities(newickParams);

  res.json({
    newick: generatedNewick,
    sequences: simulationResults,
  });
});
