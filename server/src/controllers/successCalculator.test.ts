import fs from 'fs';
import path from 'path';
import { parseCsv } from './successCalculator';

jest.mock('fs'); // Mock the 'fs' module

describe('parseCsv', () => {
  const mockCsvData = [
    'param_using_own_eggs,param_attempted_ivf_previously,param_is_reason_for_infertility_known,formula_intercept',
    'TRUE,FALSE,TRUE,1.23',
    'FALSE,N/A,FALSE,2.34',
  ].join('\n');

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('parses a valid CSV file correctly', async () => {
    // Mock the file stream
    (fs.createReadStream as jest.Mock).mockImplementation(() => {
      const Readable = require('stream').Readable;
      const stream = new Readable();
      stream.push(mockCsvData);
      stream.push(null); // End of stream
      return stream;
    });

    const filePath = path.join(__dirname, 'mock.csv');
    const result = await parseCsv(filePath);

    expect(result).toEqual([
      {
        param_using_own_eggs: true,
        param_attempted_ivf_previously: false,
        param_is_reason_for_infertility_known: true,
        formula_intercept: 1.23,
      },
      {
        param_using_own_eggs: false,
        param_attempted_ivf_previously: false,
        param_is_reason_for_infertility_known: false,
        formula_intercept: 2.34,
      },
    ]);
  });

  it('handles an empty CSV file', async () => {
    (fs.createReadStream as jest.Mock).mockImplementation(() => {
      const Readable = require('stream').Readable;
      const stream = new Readable();
      stream.push(''); // Empty content
      stream.push(null); // End of stream
      return stream;
    });

    const filePath = path.join(__dirname, 'empty.csv');
    const result = await parseCsv(filePath);

    expect(result).toEqual([]); // Should return an empty array
  });
});
