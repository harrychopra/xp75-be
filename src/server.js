import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import errorHandler from './middleware/error.middleware.js';
import apiRoutes from './routes/api.routes.js';
import authRoutes from './routes/auth.routes.js';
import dayRoutes from './routes/day.routes.js';
import milestoneRoutes from './routes/milestone.routes.js';
import profileRoutes from './routes/profile.routes.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();

app.use(cors());
app.use(cookieParser());
app.use(express.json());

app.use(express.static(path.join(__dirname, '../public')));

app.use('/api', apiRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/days', dayRoutes);
app.use('/api/milestones', milestoneRoutes);

app.use(errorHandler);

const PORT = process.env.PORT;
if (!PORT) throw new Error(`PORT not set`);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

export default app;
