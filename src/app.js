import cors from 'cors';
import express from 'express';
import loadEnv from '../config/loadEnv.js';
import apiRoutes from './routes/api.routes.js';

loadEnv();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', apiRoutes);

const PORT = process.env.API_PORT || 9090;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

export default app;
