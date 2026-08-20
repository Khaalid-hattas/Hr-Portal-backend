import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import employeeRoutes from './routes/employees.js';

dotenv.config();

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/employees', employeeRoutes);

// Test Routes
app.get('/', (req,res) => {
  res.send('ModernTech HR API is running');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`server is running on http://localhost:${PORT}`));