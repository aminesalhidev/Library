// src/models/book.ts
import mongoose, { Document, Schema } from 'mongoose';

interface IBook extends Document {
  title: string;
  author: string;
  published_year: number;
  genre: string;
  stock: number;
}

const bookSchema = new Schema<IBook>({
  title: { type: String, required: true },
  author: { type: String, required: true },
  published_year: { type: Number, required: true },
  genre: { type: String, required: true },
  stock: { type: Number, required: true }
});

const Book = mongoose.model<IBook>('Book', bookSchema);

export default Book;
