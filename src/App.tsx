import { useEffect, useState } from 'react'
import {Button, FieldError, Form, Input, Label, TextField} from 'react-aria-components';
import axios from 'axios';
import './App.css'

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [backendMessage, setBackendMessage] = useState('');

  useEffect(() => {
    // Fetch from the backend after a delay, to prove loading state works
    setTimeout(() => {
      axios.get('/api')
        .then(response => {
          setBackendMessage(response.data);
        })
        .catch(error => {
          console.error('Error fetching data:', error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }, 1000);
  }, []);

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Handle form submission
    let data = Object.fromEntries(new FormData(event.currentTarget));
    axios.post('/api/calculate-success-rate', JSON.stringify(data))
      .then(response => {
        console.log('Success rate:', response.data.successRate);
      })
      .catch(error => {
        console.error('Error submitting form:', error);
      });
    console.log('Form submitted', event);
  }

  return (
    <>
      <h1>New Demo App with Vite + React!</h1>
      <div className="message">
        <h2>Backend Message</h2>
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <p>{backendMessage}</p>
        )}
      </div>
      <div className="form-container">
      <Form onSubmit={onSubmit}>
        <TextField name="email" type="email" isRequired>
          <Label>Email</Label>
          <Input />
          <FieldError />
        </TextField>
        <Button type="submit">Submit</Button>
      </Form>
      </div>
    </>
  )
}

export default App
