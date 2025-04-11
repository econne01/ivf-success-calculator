import express, { Request, Response } from 'express';
import { calculate } from '../controllers/successCalculator';

const router = express.Router();

router.post('/calculate-success-rate', (req: Request, res: Response) => {
    const { isUsingOwnEggs, hasPrevIVF, reasonForIVF } = req.body;
    console.log('Handling request with body:', req.body);
    let successRate = calculate(reasonForIVF);
    res.status(200).json({
        successRate: successRate,
    });
});

export default router;
