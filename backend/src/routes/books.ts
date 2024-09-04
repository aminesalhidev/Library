import { Router, Request, Response } from 'express';
import Book from '../models/book';

const router = Router();

// Ottieni tutti i libri
router.get('/', async (req: Request, res: Response) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: 'Error fetching books', details: error.message });
    } else {
      res.status(500).json({ error: 'Error fetching books', details: 'Unknown error' });
    } 
  }
});

// Aggiungi un nuovo libro
router.post('/', async (req: Request, res: Response) => {
  const newBook = new Book(req.body);
  try {
    const savedBook = await newBook.save();
    res.status(201).json(savedBook);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: 'Error adding book', details: error.message });
    } else {
      res.status(500).json({ error: 'Error adding book', details: 'Unknown error' });
    }
  }
});

// Aggiorna un libro
router.put('/:id', async (req: Request, res: Response) => {
    try {
      const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (updatedBook) {
        res.json(updatedBook);
      } else {
        res.status(404).send('Book not found');
      }
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: 'Error updating book', details: error.message });
      } else {
        res.status(500).json({ error: 'Error updating book', details: 'Unknown error' });
      }
    }
  });
  
  // Elimina un libro
  router.delete('/:id', async (req: Request, res: Response) => {
    try {
      const result = await Book.findByIdAndDelete(req.params.id);
      if (result) {
        res.status(204).send();
      } else {
        res.status(404).send('Book not found');
      }
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: 'Error deleting book', details: error.message });
      } else {
        res.status(500).json({ error: 'Error deleting book', details: 'Unknown error' });
      }
    }
  });
  

export default router;
