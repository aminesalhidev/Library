import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import booksRouter from './routes/books';
import dotenv from 'dotenv';

// Carica variabili di ambiente dal file .env
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/mylibrary';

// Middleware CORS per accettare richieste da localhost:3001 (dove React è in esecuzione)
app.use(cors({ origin: 'http://localhost:3001' }));

// Middleware per il parsing dei JSON
app.use(express.json());


//Implementare un sistema di autenticazione semplice (es. tramite token JWT) per proteggere le operazioni di modifica e cancellazione.

 
// Connessione al database
mongoose.connect(mongoUri)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));

// Rotte
app.use('/books', booksRouter);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
