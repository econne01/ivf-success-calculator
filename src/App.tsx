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
      formRef.current.reset(); // Reset the form inputs
    }
  };

  return (
    <>
      <h1>New Demo App with Vite + React!</h1>
      <div className="message">
        <p>Welcome to the new demo app! This is a simple form that calculates the success rate of IVF based on user input.</p>
        <p>Please fill out the form below:</p>
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
    </>
  )
}

export default App
