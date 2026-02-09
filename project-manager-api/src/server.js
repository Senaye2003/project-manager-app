import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import userRoutes from './routes/userRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import teamRoutes from './routes/teamRoutes.js';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(morgan('tiny'));
app.use(express.json());

const specs = YAML.load('./public/bundled.yaml')
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Mount routers
app.use('/api', userRoutes);
app.use('/api', projectRoutes);
app.use('/api', taskRoutes);
app.use('/api/teams', teamRoutes);



app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  console.log(err.stack);
  if (!err.status) {
    console.log(err.stack);
    err.status = 500;
    err.message = 'Internal Server Error';
  }
  res.status(err.status).json({ error: err.message });
});

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
