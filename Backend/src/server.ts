import express from 'express';
import cors from 'cors';
import routes from './routes/route.js';

const app = express();

app.use(cors()); // Permite que o React acesse o backend
app.use(express.json()); // Permite que o servidor entenda JSON
app.use(routes);

const PORT = 3333;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});