const Book = require('../models/Book');

// GET all books
const getBooks = async (req, res, next) => {
  try {
    const books = await Book.find();
    if (!books) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.status(201).json(books);
  } catch (err) {
    console.error('[ERROR] getBooks:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
    // next(err);
  }
};

// GET single book by ID
const getBookById = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    res.status(200).json(book);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
    // next(err);
  }
};

// CREATE new book
const createBook = async (req, res, next) => {
  try {
    const { title, author, category, description, content } = req.body;

    if (!title || !author || !category || !description || !content) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const image = req.files?.image?.[0]?.filename
      ? `${req.protocol}://${req.get('host')}/uploads/${req.files.image[0].filename}`
      : null;


    const book = await Book.create({
      title,
      author,
      category,
      description,
      content,
      image
    });

    res.status(201).json(book);
  } catch (err) {
    console.error('[ERROR] createBook:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// UPDATE book
const updateBook = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });

    const { title, author, category, description, content } = req.body;

    book.title = title || book.title;
    book.author = author || book.author;
    book.category = category || book.category;
    book.description = description || book.description;
    book.content = content || book.content;

    if (req.files?.image?.[0]?.filename) {
      book.image = `${req.protocol}://${req.get('host')}/uploads/${req.files.image[0].filename}`;
    }

    const updated = await book.save();
    res.status(200).json(updated);
  } catch (err) {
    console.error('[ERROR] updateBooks:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
    // next(err);
  }
};

// DELETE book
const deleteBook = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });

    await book.remove();
    res.status(200).json({ message: 'Book deleted successfully' });
  } catch (err) {
    // next(err);
    console.error('[ERROR] deleteBook:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { getBooks, getBookById, createBook, updateBook, deleteBook };
