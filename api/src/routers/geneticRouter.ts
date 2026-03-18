import { Router } from "express";
import { Request, Response } from "express";
import { EvolveParams, evolve } from "../core/core/genetic/geneticAlgorithm";
import Joi from "joi";

export const geneticRouter = Router();

const defaultParams: EvolveParams = {
  targetDNA: "To be, or not to be, that is the question.",
  symbols:
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz,!<>@#$%^&*()_+-=. ",
  mutationRate: 0.01,
  populationSize: 1000,
  maximumGenerations: 1000,
};

const geneticSchema = Joi.object<EvolveParams>({
  populationSize: Joi.number()
    .integer()
    .min(1)
    .max(10000)
    .default(defaultParams.populationSize),
  mutationRate: Joi.number().min(0).max(1).default(defaultParams.mutationRate),
  maximumGenerations: Joi.number()
    .integer()
    .min(1)
    .max(10000)
    .default(defaultParams.maximumGenerations),
  targetDNA: Joi.string().max(1000).default(defaultParams.targetDNA),
  symbols: Joi.string().max(1000).default(defaultParams.symbols),
});

geneticRouter.get("/", async (req: Request, res: Response) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");

  const query = req.query;
  const { error, value } = geneticSchema.validate(query);

  if (error) {
    res.status(400).json({ error: error.details[0].message });
    return;
  }

  await evolve(value, (data) => {
    const payload = JSON.stringify(data);
    res.write(`data: ${payload}\n\n`);
  });

  res.end();
});
