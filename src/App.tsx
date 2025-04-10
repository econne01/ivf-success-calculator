import { useEffect, useState } from 'react'
import axios from 'axios';
import './App.css'

function App() {
  const [count, setCount] = useState(0)
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
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
    </>
  )
}

export default App
