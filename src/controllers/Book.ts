import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import Book from '../models/Book';

const createBook = (req: Request, res: Response, next: NextFunction) => {
    const { name, author } = req.body;

    const book = new Book({
        _id: new mongoose.Types.ObjectId(),
        name,
        author
    });

    return book
        .save()
        .then((book) => res.status(201).json({ book }))
        .catch((error) => res.status(500).json({ error }));
};
const readBook = (req: Request, res: Response, next: NextFunction) => {
    const authorId = req.params.authorId;

    return Book.findById(authorId)
        .then((book) => (book ? res.status(200).json({ book }) : res.status(404).json({ message: 'Not found' })))
        .catch((error) => res.status(500).json({ error }));
};

const readAll = (req: Request, res: Response, next: NextFunction) => {
    return Book.find()
        .then((authors) => res.status(200).json({ authors }))
        .catch((error) => res.status(500).json({ error }));
};
const updateBook = (req: Request, res: Response, next: NextFunction) => {
    const authorId = req.params.authorId;

    return Book.findById(authorId)
        .then((book) => {
            if (!book) {
                return res.status(404).json({ message: 'Not found' });
            }
            book.set(req.body);
            return book
                .save()
                .then((book) => res.status(201).json({ book }))
                .catch((error) => res.status(500).json({ error }));
        })
        .catch((error) => res.status(500).json({ error }));
};
const deleteBook = (req: Request, res: Response, next: NextFunction) => {
    const authorId = req.params.authorId;
    console.log('HERE');
    return Book.findByIdAndDelete(authorId)
        .then((book) => (book ? res.status(201).json({ message: 'deleted' }) : res.status(404).json({ message: 'not found' })))
        .catch((error) => res.status(500).json({ error }));
};
export default {
    createBook,
    readBook,
    readAll,
    updateBook,
    deleteBook
};
