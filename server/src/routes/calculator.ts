import express, { Request, Response } from 'express';
import { getFormula, calculate } from '../controllers/successCalculator';

const router = express.Router();

router.post('/calculate-success-rate', async (req: Request, res: Response) => {
  // console.log('Received request:', req.body);
  const {
    isUsingOwnEggs,
    hasPriorIVF,
    unknown_reason,
    age,
    height,
    weight,
    numPriorPregnancies,
    numPriorBirths,
    tubal_factor,
    male_factor_infertility,
    endometriosis,
    ovulatory_disorder,
    diminished_ovarian_reserve,
    uterine_factor,
    other_reason,
    unexplained_infertility,
  } = req.body;
  
  const formulaParams = {
    isUsingOwnEggs,
    hasPriorIVF,
    isInfertilityReasonKnown: !unknown_reason,
  };
  
  const calcParams = {
    age,
    height,
    weight,
    numPriorPregnancies,
    numPriorBirths,
  };
  
  const infertilityReasonParams = {
    tubal_factor,
    male_factor_infertility,
    endometriosis,
    ovulatory_disorder,
    diminished_ovarian_reserve,
    uterine_factor,
    other_reason,
    unexplained_infertility,
  };

  const formula = await getFormula(formulaParams);
  const successRate = await calculate(formula, calcParams, infertilityReasonParams);
  res.status(200).json({
      successRate,
  });
});

export default router;
