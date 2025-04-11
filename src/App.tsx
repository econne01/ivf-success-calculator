import { useRef, useState } from 'react'
import {Button, FieldError, Form, Input, Label, TextField} from 'react-aria-components';
import axios from 'axios';
import './App.css'

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null); // Add a ref for the form

  // Handle form submission
  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    let data = Object.fromEntries(new FormData(event.currentTarget));
    setIsLoading(true);
    console.log('Form data:', data);
    setTimeout(() => {
      console.log('Simulating a delay...');
      axios.post('/api/calculate-success-rate', JSON.stringify(data))
        .then(response => {
          console.log('Success rate:', response.data.successRate);
          clearForm();
        })
        .catch(error => {
          console.error('Error submitting form:', error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }, 1000);
  }

  // Function to clear the form inputs
  const clearForm = () => {
    if (formRef.current) {
      formRef.current.reset();
    }
  };

  return (
    <>
      <div className="app-header">
        <h1 className="app-title">IVF Success Rate Calculator</h1>
      </div>
      <div className="app-body">
        <div className="instructions-container">
          <h2>Estimate your chances of having a baby with IVF</h2>
          <p>
            This is a simple form that calculates the success rate of IVF based on user input.
            The calculations follow the{' '}
            <a href="https://www.cdc.gov/art/ivf-success-estimator/index.html">CDC estimates</a>.
            Please note that this tool has some limitations, including that it can only generate estimates for
            specific ranges for age, height and weight.
          </p>
          <p>
            Please note that the IVF Success Estimator does not provide medical advice, diagnosis, or treatment.
            You should always talk with your doctor about your specific treatment plan and potential for success.
            </p>
          <p>Fill out the form below to get your estimated rate of success:</p>
          {isLoading && <p>Loading...</p>}
        </div>
        <div className="form-container">
          <Form
            ref={formRef}
            onSubmit={onSubmit}
            onReset={clearForm}
          >
            <TextField name="email" type="email" isRequired>
              <Label>Email</Label>
              <Input />
              <FieldError />
            </TextField>
            <Button type="submit">Submit</Button>
            <Button type="reset">Start Over</Button>
          </Form>
        </div>
      </div>
    </>
  )
}

export default App
