const Bookmark = require('../models/Bookmark');

// List bookmarks for user
const getBookmarks = async (req, res, next) => {
  try {
    const bookmarks = await Bookmark.find({ user: req.user._id }).populate('book');
    res.status(200).json(bookmarks);
  } catch (err) { 
    // next(err);
    res.status(500).json({ message: 'Server error', error: err.message });
   }
};

const createBookmark = async (req, res, next) => {
  try {
    const { bookId, page, note } = req.body;
    if (!bookId || !page) return res.status(400).json({ message: 'Book ID and page are required' });
    const bm = await Bookmark.create({ user: req.user._id, book: bookId, page, note: note || '' });
    const populated = await Bookmark.findById(bm._id).populate('book');
    res.status(201).json(populated);
  } catch (err) { 
    // next(err);
    res.status(500).json({ message: 'Server error', error: err.message });
   }
};

const updateBookmark = async (req, res, next) => {
  try {
    const { page, note } = req.body;
    const bm = await Bookmark.findById(req.params.id);
    if (!bm) return res.status(404).json({ message: 'Bookmark not found' });
    const userId = req.user._id || req.user.id;
    if (bm.user.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    // if (bm.user.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Not authorized' });
    bm.page = page || bm.page;
    bm.note = note !== undefined ? note : bm.note;
    const updated = await bm.save();
    const populated = await Bookmark.findById(updated._id).populate('book');
    res.status(200).json(populated);
  } catch (err) { 
    // next(err);
    res.status(500).json({ message: 'Server error', error: err.message });
   }
};

const deleteBookmark = async (req, res, next) => {
  try {
    const bm = await Bookmark.findById(req.params.id);
    if (!bm) return res.status(404).json({ message: 'Bookmark not found' });
    const userId = req.user._id || req.user.id;
    if (bm.user.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    // if (bm.user.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Not authorized' });
    await bm.remove();
    res.status(200).json({ message: 'Bookmark deleted' });
  } catch (err) { 
    // next(err);
    res.status(500).json({ message: 'Server error', error: err.message });
    }
};

module.exports = { getBookmarks, createBookmark, updateBookmark, deleteBookmark };
