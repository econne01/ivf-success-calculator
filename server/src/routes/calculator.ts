import express, { Request, Response } from 'express';
import { getFormula, calculate } from '../controllers/successCalculator';

const router = express.Router();

router.post('/calculate-success-rate', async (req: Request, res: Response) => {
  // console.log('Received request:', req.body);
  const { isUsingOwnEggs, hasPriorIVF, unknown_reason } = req.body;

  const formulaParams = {
    isUsingOwnEggs: isUsingOwnEggs,
    hasPriorIVF: hasPriorIVF,
    isInfertilityReasonKnown: !unknown_reason,
  };
  const calcParams = {
    age: req.body.age,
    height: req.body.height,
    weight: req.body.weight,
    numPriorPregnancies: req.body.numPriorPregnancies,
    numPriorBirths: req.body.numPriorBirths,
  };
  const infertilityReasonParams = {
    tubal_factor: req.body.tubal_factor,
    male_factor_infertility: req.body.male_factor_infertility,
    endometriosis: req.body.endometriosis,
    ovulatory_disorder: req.body.ovulatory_disorder,
    diminished_ovarian_reserve: req.body.diminished_ovarian_reserve,
    uterine_factor: req.body.uterine_factor,
    other_reason: req.body.other_reason,
    unexplained_infertility: req.body.unexplained_infertility,
  };
  const formula = await getFormula(formulaParams);
  const successRate = await calculate(formula, calcParams, infertilityReasonParams);
  res.status(200).json({
      successRate,
  });
});

export default router;
