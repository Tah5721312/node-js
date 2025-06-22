const {Author,validateUpdateAuthor,validateCreateAuthor} =require("../models/Author");
const asyncHandler = require('express-async-handler');
const {  verifyTokenAndAdmin } = require("../middelwares/verifyToken");
 
/**
 *  @desc    Get all authors
 *  @route   /api/authors
 *  @method  GET
 *  @access  public
 */
module.exports.getAllAuthors =asyncHandler(async (req, res) => {
    const authors = await Author.find()
                          //    .sort({firstname:-1})
                           //   .select("firstname lastname -_id");
    res.status(200).json(authors);
  })



/**
 *  @desc    Get author by id
 *  @route   /api/authors/:id
 *  @method  GET
 *  @access  public
 */
module.exports.getAuthorById = asyncHandler(async (req, res) => {
    const author = await Author.findById(req.params.id);
    if (!author) {
      return res.status(404).json({ message: 'Author not found' });
    }
    res.status(200).json(author);
  })



/**
 *  @desc    Create new author
 *  @route   /api/authors
 *  @method  POST
 *  @access  private (only admin)
 */
module.exports.createAuthor = asyncHandler(async (req, res) => {
    const { error, value } = validateCreateAuthor(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });
  
    const author = new Author(value);
    const result = await author.save(); // save to DB
    res.status(201).json(result);
  })



/**
 *  @desc    Update an author
 *  @route   /api/authors/:id
 *  @method  PUT
 *  @access  private (only admin)
 */
module.exports.updateAuthor = asyncHandler(async (req, res) => {
    const { error, value } = validateUpdateAuthor(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });
  
    const updatedAuthor = await Author.findByIdAndUpdate(req.params.id, value, {
      new: true,
      runValidators: true
    });
  
    if (!updatedAuthor) return res.status(404).json({ message: 'Author not found' });
  
    res.status(200).json({ message: 'Author updated successfully', data: updatedAuthor });
  })



/**
 *  @desc    Delete an author
 *  @route   /api/authors/:id
 *  @method  DELETE
 *  @access  private (only admin)
 */
module.exports.deleteAuthor =asyncHandler(async (req, res) => {
    const deletedAuthor = await Author.findByIdAndDelete(req.params.id);
    if (!deletedAuthor) return res.status(404).json({ message: 'Author not found' });
  
    res.status(200).json({ message: 'Author deleted successfully', data: deletedAuthor });
  })



