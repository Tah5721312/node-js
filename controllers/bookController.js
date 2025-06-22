const asyncHandler = require('express-async-handler');
const {Book,validateCreateBook,validateUpdateBook} =require("../models/Book");


/**
 *  @desc    Get all books
 *  @route   /api/books
 *  @method  GET
 *  @access  public
 */
const getAllBooks = asyncHandler(async (req, res) => {
    const { minPrice, maxPrice, page = 1, limit = 10 } = req.query;
  
    const query = {};
  
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
  
    const skip = (Number(page) - 1) * Number(limit);
  
    const books = await Book.find(query)
      .populate('authorforbook', 'firstname lastname')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));
  
    const totalBooks = await Book.countDocuments(query);
  
    res.status(200).json({
      total: totalBooks,
      page: Number(page),
      pages: Math.ceil(totalBooks / Number(limit)),
      results: books,
    });
  })

/**
 *  @desc    Get book by id
 *  @route   /api/books/:id
 *  @method  GET
 *  @access  public
 */
const getBookById =asyncHandler(async (req, res) => {
  const book = await Book.findById(req.params.id).populate('authorforbook', 'firstname lastname');
  if (!book) return res.status(404).json({ message: 'Book not found' });
  res.status(200).json(book);
});
/**
 *  @desc    Create new book
 *  @route   /api/books
 *  @method  POST
 *  @access  private (only admin)
 */
const createBook = asyncHandler(async (req, res) => {
    const { error, value } = validateCreateBook(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });
  
    const newBook = new Book(value);
    const result = await newBook.save();
    res.status(201).json({ message: 'Book created successfully', data: result });
  });
  /**
 *  @desc    Update a book
 *  @route   /api/books/:id
 *  @method  PUT
 *  @access  private (only admin)
 */
const updateBook =asyncHandler(async (req, res) => {
    const { error, value } = validateUpdateBook(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });
  
    const updatedBook = await Book.findByIdAndUpdate(req.params.id, value, {
      new: true,
      runValidators: true
    });
  
    if (!updatedBook) return res.status(404).json({ message: 'Book not found' });
  
    res.status(200).json({ message: 'Book updated successfully', data: updatedBook });
  }); 
  
/**
 *  @desc    Delete a book
 *  @route   /api/books/:id
 *  @method  DELETE
 *  @access  private (only admin)
 */
const deleteBook = asyncHandler(async (req, res) => {
    const deletedBook = await Book.findByIdAndDelete(req.params.id);
    if (!deletedBook) return res.status(404).json({ message: 'Book not found' });
  
    res.status(200).json({ message: 'Book deleted successfully', data: deletedBook });
  });
  

  
module.exports = { getAllBooks,getBookById,createBook,
                   updateBook, deleteBook,
  };