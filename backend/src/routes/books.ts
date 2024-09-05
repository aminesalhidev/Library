import express, { Request, Response } from 'express';
import Book, { IBook } from '../models/book';

const router = express.Router();

// Recupera tutti i libri
router.get('/', async (req: Request, res: Response) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
});

// Aggiunge un nuovo libro o più libri
router.post('/', async (req: Request, res: Response) => {
    console.log('Request body:', req.body);
  
    const books = req.body;
  
    if (!Array.isArray(books)) {
      return res.status(400).json({ message: 'Il corpo della richiesta deve essere un array di libri.' });
    }
  
    for (const book of books) {
      const { title, author, published_year, genre, stock } = book;
  
      if (!title || !author || !published_year || !genre || stock === undefined) {
        return res.status(400).json({ message: 'Tutti i campi sono richiesti per ogni libro.' });
      }
    }
  
    try {
      const newBooks = await Book.insertMany(books);
      res.status(201).json(newBooks);
    } catch (err) {
      console.error('Error inserting books:', err);
      res.status(400).json({ message: (err as Error).message });
    }
  });
  

// Modifica un libro esistente
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Libro non trovato.' });

    const { title, author, published_year, genre, stock } = req.body;
    if (title) book.title = title;
    if (author) book.author = author;
    if (published_year) book.published_year = published_year;
    if (genre) book.genre = genre;
    if (stock !== undefined) book.stock = stock;

    const updatedBook = await book.save();
    res.json(updatedBook);
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
});

// Rimuove un libro
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const result = await Book.deleteOne({ _id: req.params.id });
    if (result.deletedCount === 0) return res.status(404).json({ message: 'Libro non trovato.' });

    res.json({ message: 'Libro rimosso con successo.' });
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
});

export default router;
