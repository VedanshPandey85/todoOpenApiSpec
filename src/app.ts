import express from 'express';
import todoRoutes from './routes/todoRoutes';
import { setupSwagger } from './swagger';

const app = express();
const PORT = 5000;

app.use(express.json());
app.use('/api', todoRoutes);

setupSwagger(app);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});