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



export async function calculate(reasonForIVF: string): Promise<number> {
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
