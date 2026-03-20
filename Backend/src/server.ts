import express from 'express';
import cors from 'cors';
import routes from './routes/route.js';
import fileUpload from 'express-fileupload';
import path from 'path';

const app = express();

app.use(cors()); // Permite que o React acesse o backend
app.use(express.json()); // Permite que o servidor entenda JSON
app.use(fileUpload()); // Permite upload de arquivos
app.use(routes);
app.use('/arquivos', express.static(path.join(process.cwd(), 'uploads')))


const PORT = 3333;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});