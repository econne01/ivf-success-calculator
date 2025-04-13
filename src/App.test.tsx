import { render, screen, fireEvent, within, waitFor } from '@testing-library/react';
import axios from 'axios';
import App from './App';
    
jest.mock('axios'); // Mock axios

async function fillRequiredFields(overrides: Partial<Record<string, string | boolean>> = {}) {
  // Default values for the form fields
  const defaults = {
    isUsingOwnEggs: 'own-eggs',
    numPrevIVF: '2',
    numPrevPregnancies: '1',
    numPrevDeliveries: '1',
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

  // Fill in the "numPrevIVF" field (if applicable)
  const numPrevIVFDropdown = screen.getByLabelText(/have you used ivf in the past/i); // Locate the dropdown
  fireEvent.click(numPrevIVFDropdown); // Open the dropdown

  const numPrevIVFOption = within(screen.getByRole('dialog'))
    .getByRole('option', { name: new RegExp(values.numPrevIVF as string, 'i') }); // Locate the specific option
  fireEvent.click(numPrevIVFOption); // Select the option

  // Fill in the "numPrevPregnancies" field (if applicable)
  const numPrevPregnanciesButton = screen.getByLabelText(/how many prior pregnancies have you had/i);
  fireEvent.click(numPrevPregnanciesButton);

  const numPrevPregnanciesOption = within(screen.getByRole('dialog'))
    .getByText(new RegExp(values.numPrevPregnancies as string, 'i'));
  fireEvent.click(numPrevPregnanciesOption);

  // Fill in the "numPrevDeliveries" field (if applicable)
  const numPrevDeliveriesButton = screen.getByLabelText(/how many prior births have you had/i);
  fireEvent.click(numPrevDeliveriesButton);

  const numPrevDeliveriesOption = within(screen.getByRole('dialog'))
    .getByText(new RegExp(values.numPrevDeliveries as string, 'i'));
  fireEvent.click(numPrevDeliveriesOption);

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
    }, { timeout: 3000 }); // Set max waiting time to 3 seconds
  });
});
