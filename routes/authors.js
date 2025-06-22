const express = require('express');
const router = express.Router();
const {  verifyTokenAndAdmin } = require("../middelwares/verifyToken");
const {getAllAuthors,getAuthorById,createAuthor,updateAuthor,deleteAuthor}= require('../controllers/authorController'); // غيّر المسار حسب مكان الملف
    
 ////api/authors
 router.route("/")
       .get(getAllAuthors )
       .post(verifyTokenAndAdmin,createAuthor );

 ////api/authors/:id
 router.route("/:id")
       .get(getAuthorById)
       .delete( verifyTokenAndAdmin,deleteAuthor)
       .put(verifyTokenAndAdmin,updateAuthor);

module.exports = router;
