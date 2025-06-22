const express = require('express');
const router = express.Router();
const {  verifyTokenAndAdmin } = require("../middelwares/verifyToken");
const {
  getAllBooks,getBookById,
  createBook,updateBook,deleteBook} = require("../controllers/bookController");
/**
 *  @desc    Get all books
 *  @route   /api/books
 *  @method  GET
 *  @access  public
 */

// /api/books
router.route("/").get(getAllBooks)
                 .post(verifyTokenAndAdmin, createBook);


// /api/books/:id
router.route("/:id")
  .get(getBookById)
  .put(verifyTokenAndAdmin, updateBook)
  .delete(verifyTokenAndAdmin, deleteBook);


module.exports = router;
