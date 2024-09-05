import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';

// Connessione a MongoDB
mongoose.connect('mongodb://localhost:27017/library')
  .then(() => console.log('MongoDB connected'))
  .catch((err: Error) => console.error('MongoDB connection error:', err));

// Definizione dello Schema e del Modello
const bookSchema = new mongoose.Schema({
  title: String,
  author: String,
  published_year: Number,
  genre: String,
  stock: Number,
});

const Book = mongoose.model('Book', bookSchema);

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Rotte

// Recupera tutti i libri
// Recupera tutti i libri con supporto per la ricerca
app.get('/books', async (req: Request, res: Response) => {
    try {
      const { title, author } = req.query;
  
      // Crea un oggetto di ricerca basato sui parametri della query
      const query: any = {};
      if (title) query.title = new RegExp(title as string, 'i'); // Cerca il titolo in modo case-insensitive
      if (author) query.author = new RegExp(author as string, 'i'); // Cerca l'autore in modo case-insensitive
  
      const books = await Book.find(query);
      res.json(books);
    } catch (err) {
      res.status(500).json({ message: (err as Error).message });
    }
  });
  // src/index.ts (o il tuo file di configurazione del server Express)

// Recupera suggerimenti basati sui titoli dei libri
app.get('/books/suggestions', async (req: Request, res: Response) => {
    try {
      const { query } = req.query;
      const books = await Book.find({ title: new RegExp(query as string, 'i') }).limit(10);
      const suggestions = books.map(book => book.title);
      res.json(suggestions);
    } catch (err) {
      res.status(500).json({ message: (err as Error).message });
    }
  });
  
// Aggiunge un nuovo libro
app.post('/books', async (req: Request, res: Response) => {
  const book = req.body;
  const { title, author, published_year, genre, stock } = book;

  if (!title || !author || !published_year || !genre || stock === undefined) {
    return res.status(400).json({ message: 'Tutti i campi sono richiesti per il libro.' });
  }

  try {
    const newBook = await Book.create(book);
    res.status(201).json(newBook);
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
});

// Modifica un libro esistente
app.put('/books/:id', async (req: Request, res: Response) => {
  try {
    const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedBook) return res.status(404).json({ message: 'Libro non trovato.' });

    res.json(updatedBook);
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
});

// Rimuove un libro
app.delete('/books/:id', async (req: Request, res: Response) => {
  try {
    const result = await Book.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ message: 'Libro non trovato.' });

    res.json({ message: 'Libro rimosso con successo.' });
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
});

app.listen(3000, () => console.log('Server running on port 3000'));
