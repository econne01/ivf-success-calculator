import express, { Request, Response } from 'express';
import { getFormula, calculate } from '../controllers/successCalculator';

const router = express.Router();

router.post('/calculate-success-rate', async (req: Request, res: Response) => {
    const { isUsingOwnEggs, hasPrevIVF, reasonForIVF } = req.body;
    console.log('Handling request with body:', req.body);

    const formula = await getFormula(req.body);
    console.log('Formula:', formula);
    let successRate = await calculate(reasonForIVF);
    res.status(200).json({
        successRate: successRate,
    });
});

export default router;
