const express = require('express');
const router = express.Router();
const { verifyTokenAndAuthorization,
        verifyTokenAndAdmin } = require("../middelwares/verifyToken");
const {getAllUsers,getUserById
      ,deleteUser,updateUser}= require('../controllers/userController');
  


 ////api/users
 
 router.get('/', verifyTokenAndAdmin, getAllUsers   );
  

 ////api/users/:id
 router.route("/:id")
       .get(verifyTokenAndAdmin,getUserById )
       .delete( verifyTokenAndAdmin,deleteUser)
       .put(verifyTokenAndAuthorization,updateUser)

  module.exports = router;