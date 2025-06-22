const mongoose = require('mongoose');
const Joi = require('joi');

const AuthorSchema = new mongoose.Schema({
  firstname: { type: String, required: true, trim: true, maxlength: 15, minlength: 3 },
  lastname: { type: String, required: true, trim: true, maxlength: 15, minlength: 3 },
  image: { type: String, default: "default.avatar.png" }
}, {
  timestamps: true  // Enable createdAt and updatedAt fields
});




// التحقق من بيانات الإنشاء
function validateCreateAuthor(obj) {
  const schema = Joi.object({
    firstname: Joi.string().min(3).required(),
    lastname: Joi.string().min(3).required(),
    image: Joi.string().optional()
  });

  return schema.validate(obj);
}

// التحقق من بيانات التحديث
function validateUpdateAuthor(obj) {
  const schema = Joi.object({
    firstname: Joi.string().min(3).required(),
    lastname: Joi.string().min(3).required(),
    image: Joi.string().optional()
  });

  return schema.validate(obj);
}



const Author = mongoose.model('Author', AuthorSchema);

module.exports ={Author,validateUpdateAuthor,validateCreateAuthor}