import express from 'express';
import calulatorRouter from './routes/calculator';

const app = express();
const port = 5000;

app.get('/api', (req, res) => {
  res.send('Hello from the backend!');
});
// This route acts as a health check
app.get('/api/heartbeat', (req, res) => {
  res.status(200).send('OK');
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', calulatorRouter);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
