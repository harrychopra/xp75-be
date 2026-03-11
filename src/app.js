import cors from 'cors';
import express from 'express';
import loadEnv from '../config/loadEnv.js';
import errorHandler from './middleware/error.middleware.js';
import apiRoutes from './routes/api.routes.js';
import authRoutes from './routes/auth.routes.js';
import daysRoutes from './routes/days.routes.js';
import profileRoutes from './routes/profile.routes.js';

loadEnv();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', apiRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/days', daysRoutes);

app.use(errorHandler);

const PORT = process.env.API_PORT || 9090;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

export default app;
