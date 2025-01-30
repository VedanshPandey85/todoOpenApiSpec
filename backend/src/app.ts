import express from 'express';
// import { setupSwagger } from './swagger';
import todoRoutes from './routes/todoRoutes';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import { JsonObject } from 'swagger-ui-express';
import path from 'path';

const app = express();

const swaggerDocument: JsonObject = YAML.load(path.join(__dirname, 'docs', 'openapi.yaml'));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(express.json());
app.use('/api', todoRoutes);

// setupSwagger(app);
const PORT = process.env.PORT||3000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Swagger running on http://localhost:${PORT}/api-docs`);
});