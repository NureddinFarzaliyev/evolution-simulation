import { Router } from "express";
import {
  gotoh,
  GotohParameters,
} from "../core/core/sequenceAlignment/gotohAlgorithm";
import BLOSUM62 from "../core/data/blosum62.json";
import Joi from "joi";

export const gotohRouter = Router();

const defaultParams: GotohParameters = {
  scoringMatrix: BLOSUM62,
  gapOpen: -11,
  gapExtend: -1,
  lambda: 0.3176,
  k: 0.134,
};

interface InputWithGotohParams extends GotohParameters {
  a: string;
  b: string;
}

const gotohSchema = Joi.object<InputWithGotohParams>({
  a: Joi.string().max(1000).required(),
  b: Joi.string().max(1000).required(),
  gapOpen: Joi.number().min(-100).max(0).default(defaultParams.gapOpen),
  gapExtend: Joi.number().min(-100).max(0).default(defaultParams.gapExtend),
  lambda: Joi.number().min(0).max(1).default(defaultParams.lambda),
  k: Joi.number().min(0).max(1).default(defaultParams.k),
});

gotohRouter.get("/", async (req, res) => {
  const query = req.query;
  const { error, value } = gotohSchema.validate(query);

  if (error) {
    res.status(400).json({ error: error.details[0].message });
    return;
  }

  const response = gotoh(value.a, value.b, {
    scoringMatrix: BLOSUM62,
    gapOpen: value.gapOpen,
    gapExtend: value.gapExtend,
    lambda: value.lambda,
    k: value.k,
  });

  res.json(response);
});
