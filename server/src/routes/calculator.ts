import express, { Request, Response } from 'express';
import { getFormula, calculate } from '../controllers/successCalculator';

const router = express.Router();

router.post('/calculate-success-rate', async (req: Request, res: Response) => {
    console.log('Received request:', req.body);
    const { isUsingOwnEggs, hasPriorIVF, unknown_reason } = req.body;

    const formulaParams = {
        isUsingOwnEggs: isUsingOwnEggs,
        hasPriorIVF: hasPriorIVF,
        isInfertilityReasonKnown: !unknown_reason,
    };
    const formula = await getFormula(formulaParams);
    console.log('Formula:', formula);
    let successRate = await calculate(formulaParams);
    res.status(200).json({
        successRate: successRate,
    });
});

export default router;
