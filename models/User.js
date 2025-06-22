const mongoose = require('mongoose');
const Joi = require('joi');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
    email: { type: String, required: true,lowercase: true, trim: true, maxlength: 100, minlength: 5 , unique:true },
    username: { type: String, required: true, trim: true, maxlength: 15, minlength: 3 },
    password: { type: String, required: true, minlength:6 },
    isAdmin: { type: Boolean,default:false },
}, {
    timestamps: true  // Enable createdAt and updatedAt fields
  });


  // Generate Token
UserSchema.methods.generateToken = function() {
  return jwt.sign({ id: this._id, isAdmin: this.isAdmin },process.env.JWT_SECRET);
}

// Validate Register User
function validateRegisterUser(obj) {
    const schema = Joi.object({
      email: Joi.string().trim().min(5).max(100).required().email(),
      username: Joi.string().trim().min(2).max(200).required(),
    //   password: passwordComplexity().required(),
      password: Joi.string().trim().min(2).max(200).required(),
      isAdmin:  Joi.bool(),
    });
    return schema.validate(obj);
  }
  
  // Validate Login User
  function validateLoginUser(obj) {
    const schema = Joi.object({
      email: Joi.string().trim().min(5).max(100).required().email(),
      password: Joi.string().trim().min(6).required(),
    });
    return schema.validate(obj);
  }
  
  // Validate Change Password
  function validateChangePassword(obj) {
    const schema = Joi.object({
      password: Joi.string().trim().min(6).required(),
    });
    return schema.validate(obj);
  }
  
  // Validate Update User
  function validateUpdateUser(obj) {
    const schema = Joi.object({
      email: Joi.string().trim().min(5).email(),
      username: Joi.string().trim().min(2),
      password: Joi.string().trim().min(6),
    });
    return schema.validate(obj);
  }
  
  const User = mongoose.model('User', UserSchema);

  module.exports = {
    User,validateLoginUser,validateRegisterUser,
    validateUpdateUser,validateChangePassword
  };

  