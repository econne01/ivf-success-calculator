import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';

async function parseCsv(filePath: string): Promise<Record<string, string>[]> {
  return new Promise((resolve, reject) => {
    const results: Record<string, string>[] = [];

    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => resolve(results))
      .on('error', (error) => reject(error));
  });
}

type FormulaSelectionParams = {
  isUsingOwnEggs: boolean;
  hasPrevIVF: boolean;
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
  diminished_ovarian_reserve: boolean;
  uterine_factor: boolean;
};

export async function calculate(formulaParams: FormulaSelectionParams, reasonForIVF: string): Promise<number> {
  const filePath = path.join(path.dirname(__dirname), 'data', 'ivf_success_formulas.csv');
  console.log('File path:', filePath);
  try {
    const data = await parseCsv(filePath);
    console.log('Parsed CSV Data:', data);
  } catch (error) {
    console.error('Error parsing CSV:', error);
  }
  return Math.random();
}
