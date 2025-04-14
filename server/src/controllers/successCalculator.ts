import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';

async function parseCsv(filePath: string): Promise<IVFSuccessFormulaRow[]> {
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

type FormulaSelectionParams =
  | {
      isUsingOwnEggs: true;
      hasPriorIVF: boolean; // Required when isUsingOwnEggs is true
      isInfertilityReasonKnown: boolean;
    }
  | {
      isUsingOwnEggs: false;
      isInfertilityReasonKnown: boolean;
    };

type FormulaCalculationParams = {
  age: number;
  height: number; // in inches, from 4'6" to 6'0", aka 54" to 72"
  weight: number; // in lbs, from 80 to 300
  numPriorPregnancies: number; // 0 to 2. Any more than 2 is counted the same as 2
  numPriorBirths: number; // 0 to 2. Any more than 2 is counted the same as 2
};

type InfertilityReasonParams = {
  tubal_factor: boolean;
  male_factor_infertility: boolean;
  endometriosis: boolean;
  ovulatory_disorder: boolean;
  diminished_ovarian_reserve: boolean;
  uterine_factor: boolean;
  other_reason: boolean;
  unexplained_infertility: boolean;
};

// create a custom type to represent integers
type Integer = number & { __integer: true };

// This type defines the structure of the data in the CSV file
type IVFSuccessFormulaRow = {
  // Parameters for finding the relevant formula
  param_using_own_eggs: boolean;
  param_attempted_ivf_previously: boolean;
  param_is_reason_for_infertility_known: boolean;
  cdc_formula: string;
  // calculation params for Age & BMI score
  formula_intercept: number;
  formula_age_linear_coefficient: number;
  formula_age_power_coefficient: number;
  formula_age_power_factor: number;
  formula_bmi_linear_coefficient: number;
  formula_bmi_power_coefficient: number;
  formula_bmi_power_factor: Integer;
  // coefficients for the infertility reasons
  formula_tubal_factor_true_value: number;
  formula_tubal_factor_false_value: Integer;
  formula_male_factor_infertility_true_value: number;
  formula_male_factor_infertility_false_value: Integer;
  formula_endometriosis_true_value: number;
  formula_endometriosis_false_value: Integer;
  formula_ovulatory_disorder_true_value: number;
  formula_ovulatory_disorder_false_value: Integer;
  formula_diminished_ovarian_reserve_true_value: number;
  formula_diminished_ovarian_reserve_false_value: Integer;
  formula_uterine_factor_true_value: number;
  formula_uterine_factor_false_value: Integer;
  formula_other_reason_true_value: number;
  formula_other_reason_false_value: Integer;
  formula_unexplained_infertility_true_value: number;
  formula_unexplained_infertility_false_value: Integer;
  // coefficients for the number of prior pregnancies
  formula_prior_pregnancies_0_value: Integer;
  formula_prior_pregnancies_1_value: number;
  'formula_prior_pregnancies_2+_value': number;
  // coefficients for the number of prior births
  formula_prior_live_births_0_value: Integer;
  formula_prior_live_births_1_value: number;
  'formula_prior_live_births_2+_value': number;
};
type IVFSuccessFormulaRowKeys = keyof IVFSuccessFormulaRow;


const formulaPropToHeaderMap: Record<string, IVFSuccessFormulaRowKeys> = {
  isUsingOwnEggs: 'param_using_own_eggs',
  hasPriorIVF: 'param_attempted_ivf_previously',
  isInfertilityReasonKnown: 'param_is_reason_for_infertility_known',
};

export async function getFormula(formulaParams: FormulaSelectionParams): Promise<IVFSuccessFormulaRow> {
  const filePath = path.join(path.dirname(__dirname), 'data', 'ivf_success_formulas.csv');
  let data: IVFSuccessFormulaRow[] = [];

  try {
    data = await parseCsv(filePath);
    console.log('Parsed CSV Data:', data);
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

export async function calculate(reasonForIVF: string): Promise<number> {
  const filePath = path.join(path.dirname(__dirname), 'data', 'ivf_success_formulas.csv');
  try {
    const data = await parseCsv(filePath);
    console.log('Parsed CSV Data:', data);
  } catch (error) {
    console.error('Error parsing CSV:', error);
  }
  return Math.random();
}
