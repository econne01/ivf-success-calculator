import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import {
  IVFSuccessFormulaRow,
  FormulaSelectionParams,
  FormulaCalculationParams,
  InfertilityReasonParams,
  IVFFormulaInfertilityScores,
  IVFFormulaPriorScores
} from './IVFSuccessFormulaRow';

export async function parseCsv(filePath: string): Promise<IVFSuccessFormulaRow[]> {
  return new Promise((resolve, reject) => {
    const results: IVFSuccessFormulaRow[] = [];

    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => {
        // Transform each row to parse values
        const transformedRow = Object.fromEntries(
          Object.entries(data).map(([key, value]) => {
            if (value === 'TRUE') return [key, true]; // Convert "TRUE" to true
            if (value === 'FALSE' || value === 'N/A') return [key, false]; // Convert "FALSE" to false
            if (!isNaN(Number(value))) return [key, Number(value)]; // Convert numeric strings to numbers
            return [key, value]; // Keep other values as strings
          })
        ) as IVFSuccessFormulaRow;

        results.push(transformedRow);
      })
      .on('end', () => resolve(results as IVFSuccessFormulaRow[]))
      .on('error', (error) => reject(error));
  });
}

export async function getFormula(formulaParams: FormulaSelectionParams): Promise<IVFSuccessFormulaRow> {
  const filePath = path.join(path.dirname(__dirname), 'data', 'ivf_success_formulas.csv');
  let data: IVFSuccessFormulaRow[] = [];

  try {
    data = await parseCsv(filePath);
  } catch (error) {
    console.error('Error parsing CSV:', error);
  }

  // Filter the Forumla rows to match the selection criteria in formulaParams
  const formula = data.find((row: IVFSuccessFormulaRow) => {
    return row.param_using_own_eggs === formulaParams.isUsingOwnEggs &&
           (!formulaParams.isUsingOwnEggs || row.param_attempted_ivf_previously === formulaParams.hasPriorIVF) &&
           row.param_is_reason_for_infertility_known === formulaParams.isInfertilityReasonKnown;
  });
  if (!formula) {
    throw new Error('No matching formula found');
  }
  return formula;
}

export async function calculate(
    formula: IVFSuccessFormulaRow,
    calcParams: FormulaCalculationParams,
    reasonParams: InfertilityReasonParams
): Promise<number> {
  const interceptScore = formula['formula_intercept'];

  const ageScore = 
    formula['formula_age_linear_coefficient'] * calcParams['age'] +
    formula['formula_age_power_coefficient'] * Math.pow(calcParams['age'], formula['formula_age_power_factor']);
  
  const userBMI = calcParams['weight'] / Math.pow(calcParams['height'], 2) * 703;
  const BMIScore =
    formula['formula_bmi_linear_coefficient'] * userBMI +
    formula['formula_bmi_power_coefficient'] * Math.pow(userBMI, formula['formula_bmi_power_factor']);

  // Calculate the infertility reason scores
  let infertilityReasonScore = 0;
  for (const reason of Object.keys(reasonParams) as (keyof InfertilityReasonParams)[]) {
    // we need to convert to unknown first to avoid type errors
    const key = `formula_${reason}_${reasonParams[reason] ? 'true' : 'false'}_value` as keyof IVFFormulaInfertilityScores;
    if (formula[key] !== undefined) {
      infertilityReasonScore += formula[key];
    }
  }

  // Calculate the prior pregnancy and birth scores
  const priorPregnancyCnt = Math.max(0, Math.min(2, calcParams.numPriorPregnancies));
  const priorPregnancyKey =`formula_prior_pregnancies_${
      priorPregnancyCnt === 2 ? '2+' : priorPregnancyCnt
    }_value` as keyof IVFFormulaPriorScores;
  const priorPregnancyScore = formula[priorPregnancyKey];


  const priorBirthsCnt = Math.max(0, Math.min(2, calcParams.numPriorBirths));
  const priorBirthKey =`formula_prior_live_births_${
    priorBirthsCnt === 2 ? '2+' : priorBirthsCnt
    }_value` as keyof IVFFormulaPriorScores;
  const priorBirthsScore = formula[priorBirthKey];

  const score = interceptScore +
    ageScore +
    BMIScore +
    infertilityReasonScore +
    priorPregnancyScore +
    priorBirthsScore;
  return Math.exp(score) / (1 + Math.exp(score));
}
