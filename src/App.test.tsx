import { render, screen, fireEvent, within, waitFor } from '@testing-library/react';
import axios from 'axios';
import App from './App';
    
jest.mock('axios'); // Mock axios

async function fillRequiredFields(overrides: Partial<Record<string, string>> = {}) {
  // Default values for the form fields
  const defaults = {
    isUsingOwnEggs: 'Own Eggs',
    numPriorIVF: '2',
    numPriorPregnancies: '1',
    numPriorBirths: '1',
    reasonForIVF: 'unexplained',
    age: '40',
    heightFeet: '5',
    heightInches: '6',
    weight: '125',
  };

  // Merge defaults with overrides
  const values = { ...defaults, ...overrides };

  // Fill in the "isUsingOwnEggs" field
  const isUsingOwnEggsButton = screen.getByLabelText(/do you plan to use your own eggs or donor eggs/i);
  fireEvent.click(isUsingOwnEggsButton);

  const ownEggsOption = screen.getByRole('option', { name: new RegExp(values.isUsingOwnEggs as string, 'i') });
  fireEvent.click(ownEggsOption);

  // Fill in the "numPriorIVF" field (if applicable)
  const numPriorIVFDropdown = screen.getByLabelText(/have you used ivf in the past/i);
  fireEvent.click(numPriorIVFDropdown);

  const numPriorIVFOption = within(screen.getByRole('dialog'))
    .getByRole('option', { name: new RegExp(values.numPriorIVF as string, 'i') })
  fireEvent.click(numPriorIVFOption);

  // Fill in the "numPriorPregnancies" field (if applicable)
  const numPriorPregnanciesButton = screen.getByLabelText(/how many prior pregnancies have you had/i);
  fireEvent.click(numPriorPregnanciesButton);

  const numPriorPregnanciesOption = within(screen.getByRole('dialog'))
    .getByText(new RegExp(values.numPriorPregnancies as string, 'i'));
  fireEvent.click(numPriorPregnanciesOption);

  // Fill in the "numPriorBirths" field (if applicable)
  const numPriorBirthsButton = screen.getByLabelText(/how many prior births have you had/i);
  fireEvent.click(numPriorBirthsButton);

  const numPriorBirthsOption = within(screen.getByRole('dialog'))
    .getByText(new RegExp(values.numPriorBirths as string, 'i'));
  fireEvent.click(numPriorBirthsOption);

  // Fill in the "reasonForIVF" field
  const reasonForIVFSelect = screen.getByLabelText(/reason for your ivf treatment/i);
  fireEvent.click(reasonForIVFSelect);

  const reasonOption = screen.getByText(new RegExp(values.reasonForIVF as string, 'i'));
  fireEvent.click(reasonOption);

  // Fill in the "age" field
  const ageInput = screen.getByRole('textbox', { name: /age/i });
  fireEvent.change(ageInput, { target: { value: values.age } });

  // Fill in the "height" fields
  const heightFeetInput = screen.getByRole('textbox', { name: /height \(feet\)/i });
  fireEvent.change(heightFeetInput, { target: { value: values.heightFeet } });

  const heightInchesInput = screen.getByRole('textbox', { name: /height \(inches\)/i });
  fireEvent.change(heightInchesInput, { target: { value: values.heightInches } });

  // Fill in the "weight" field
  const weightInput = screen.getByRole('textbox', { name: /weight/i });
  fireEvent.change(weightInput, { target: { value: values.weight } });
}

describe('App Form Submission', () => {
  let mockedAxiosPost: jest.SpyInstance;

  beforeEach(() => {
    mockedAxiosPost = jest.spyOn(axios, 'post').mockResolvedValue({ data: { successRate: 0.75 } });
    render(<App />);
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('sends isUsingOwnEggs=true when isUsingOwnEggs is set to "own-eggs"', async () => {
    await fillRequiredFields({
      isUsingOwnEggs: 'Own Eggs',
    });

    // Submit the form
    const submitButton = screen.getByRole('button', { name: /submit/i });
    fireEvent.click(submitButton);

    // Wait for the axios.post call
    await waitFor(() => {
      expect(mockedAxiosPost).toHaveBeenCalledWith(
        '/api/calculate-success-rate',
        expect.stringContaining('"isUsingOwnEggs":true')
      );
    }, { timeout: 3000 });
  });

  describe('sets whether user has previous IVF', () => {
    it('hasPriorIVF=false for 0 previous IVF', async () => {
      await fillRequiredFields({
        numPriorIVF: 'never',
      });

      // Submit the form
      const submitButton = screen.getByRole('button', { name: /submit/i });
      fireEvent.click(submitButton);

      // Wait for the axios.post call
      await waitFor(() => {
        expect(mockedAxiosPost).toHaveBeenCalledWith(
          '/api/calculate-success-rate',
          expect.stringContaining('"hasPriorIVF":false')
        );
      }, { timeout: 3000 });
    });

    it('hasPriorIVF=true for 1 previous IVF', async () => {
      await fillRequiredFields({
        numPriorIVF: '1',
      });

      // Submit the form
      const submitButton = screen.getByRole('button', { name: /submit/i });
      fireEvent.click(submitButton);

      // Wait for the axios.post call
      await waitFor(() => {
        expect(mockedAxiosPost).toHaveBeenCalledWith(
          '/api/calculate-success-rate',
          expect.stringContaining('"hasPriorIVF":true')
        );
      }, { timeout: 3000 });
    });

    it('hasPriorIVF=true for 3+ previous IVF', async () => {
      await fillRequiredFields({
        numPriorIVF: '3 or more',
      });

      // Submit the form
      const submitButton = screen.getByRole('button', { name: /submit/i });
      fireEvent.click(submitButton);

      // Wait for the axios.post call
      await waitFor(() => {
        expect(mockedAxiosPost).toHaveBeenCalledWith(
          '/api/calculate-success-rate',
          expect.stringContaining('"hasPriorIVF":true')
        );
      }, { timeout: 3000 });
    });
  });

  describe('Number of previous pregnancies', () => {
    it('sets 0 for None', async () => {
      await fillRequiredFields({
        numPriorPregnancies: 'None',
      });

      // Submit the form
      const submitButton = screen.getByRole('button', { name: /submit/i });
      fireEvent.click(submitButton);

      // Wait for the axios.post call
      await waitFor(() => {
        expect(mockedAxiosPost).toHaveBeenCalledWith(
          '/api/calculate-success-rate',
          expect.stringContaining('"numPriorPregnancies":0')
        );
      }, { timeout: 3000 });
    });

    it('sets 2 for "2 or more"', async () => {
      await fillRequiredFields({
        numPriorPregnancies: '2 or more',
      });

      // Submit the form
      const submitButton = screen.getByRole('button', { name: /submit/i });
      fireEvent.click(submitButton);

      // Wait for the axios.post call
      await waitFor(() => {
        expect(mockedAxiosPost).toHaveBeenCalledWith(
          '/api/calculate-success-rate',
          expect.stringContaining('"numPriorPregnancies":2')
        );
      }, { timeout: 3000 });
    });
  });

  describe('Number of previous births', () => {
    it('sets 0 for None', async () => {
      await fillRequiredFields({
        numPriorBirths: 'None',
      });

      // Submit the form
      const submitButton = screen.getByRole('button', { name: /submit/i });
      fireEvent.click(submitButton);

      // Wait for the axios.post call
      await waitFor(() => {
        expect(mockedAxiosPost).toHaveBeenCalledWith(
          '/api/calculate-success-rate',
          expect.stringContaining('"numPriorBirths":0')
        );
      }, { timeout: 3000 });
    });

    it('sets 2 for "2 or more"', async () => {
      await fillRequiredFields({
        numPriorBirths: '2 or more',
      });

      // Submit the form
      const submitButton = screen.getByRole('button', { name: /submit/i });
      fireEvent.click(submitButton);

      // Wait for the axios.post call
      await waitFor(() => {
        expect(mockedAxiosPost).toHaveBeenCalledWith(
          '/api/calculate-success-rate',
          expect.stringContaining('"numPriorBirths":2')
        );
      }, { timeout: 3000 });
    });

    it('disables options that exceed number of prior pregnancies', async () => {
      await fillRequiredFields({
        numPriorPregnancies: '1',
        numPriorBirths: '1',
      });

      // verify that option for 2 or more is not available
      const numPriorBirthsButton = screen.getByLabelText(/how many prior births have you had/i);
      fireEvent.click(numPriorBirthsButton);
      const numPriorBirthsOption = within(screen.getByRole('dialog'))
        .queryByText(/2 or more/i);
      expect(numPriorBirthsOption).toBeDisabled();
    });

    it('resets numPriorBirths when numPriorPregnancies changes to make it invalid', async () => {
      await fillRequiredFields({
        numPriorPregnancies: '2 or more',
        numPriorBirths: '2 or more',
      });

      // when numPriorPregnancies changes to 1...
      const numPriorPregnanciesButton = screen.getByLabelText(/how many prior pregnancies have you had/i);
      fireEvent.click(numPriorPregnanciesButton);
      const numPriorPregnanciesOption = within(screen.getByRole('dialog'))
        .getByText(/1/i);
      fireEvent.click(numPriorPregnanciesOption);

      // ...expect the numPriorBirths to be reset
      const numPriorBirthsButton = screen.getByLabelText(/how many prior births have you had/i);
      expect(numPriorBirthsButton).toHaveTextContent('Select an item');
    });
  });
});
