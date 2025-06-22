const asyncHandler = require('express-async-handler');
const bcrypt = require('bcrypt');
const { User, validateUpdateUser } = require('../models/User');
const {  verifyToken , verifyTokenAndAuthorization,
        verifyTokenAndAdmin } = require("../middelwares/verifyToken");
  
        
/**
 *  @desc    Update User
 *  @route   /api/users/:id
 *  @method  PUT
 *  @access  private (only admin & user himself)
 */
module.exports.updateUser = asyncHandler(async (req, res) => {
    
    const { error, value } = validateUpdateUser(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });
  
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "المستخدم غير موجود." });
  
    // تحقق من تكرار البريد
    if (value.email && value.email !== user.email) {
      const emailExists = await User.findOne({ email: value.email });
      if (emailExists) {
        return res.status(409).json({ message: "هذا البريد الإلكتروني مستخدم من قبل مستخدم آخر." });
      }
      user.email = value.email;
    }
  
    if (value.username) user.username = value.username;
  
    if (value.password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(value.password, salt);
    }
  
    const updatedUser = await user.save();
    const { password, ...userWithoutPassword } = updatedUser._doc;
    res.status(200).json(userWithoutPassword);
  })


/**
 *  @desc    Get All Users
 *  @route   /api/users
 *  @method  GET
 *  @access  private (only admin)
 */
module.exports.getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find().select('-password'); // exclude password
    res.status(200).json(users);
  })

/**
 *  @desc    Get User By Id
 *  @route   /api/users/:id
 *  @method  GET
 *  @access  private (only admin & user himself)
 */
module.exports.getUserById = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: "المستخدم غير موجود." });
    res.status(200).json(user);
  })



/**
 *  @desc    Delete User
 *  @route   /api/users/:id
 *  @method  DELETE
 *  @access  private (only admin & user himself)
 */
module.exports.deleteUser =  asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "المستخدم غير موجود." });
  
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "تم حذف المستخدم بنجاح." });
  })


