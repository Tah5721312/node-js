const mongoose = require('mongoose');
const Joi = require('joi');

const BookSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true, maxlength: 150, minlength: 3 },
    description: { type: String, required: true, trim: true, maxlength: 95, minlength: 3 },
    cover: { type: String, required: true,enum:["soft","hard"]},
    price: { type: Number, required: true, min:0 },
    authorforbook:{type:mongoose.Schema.Types.ObjectId , required: true,ref:"Author"}
}, {
    timestamps: true  // Enable createdAt and updatedAt fields
  });
  
//////////////////////////////////////  

  
function validateCreateBook(obj) {
    const schema = Joi.object({
      title: Joi.string().min(3).max(15).required(),
      description: Joi.string().min(3).max(95).required(),
      cover: Joi.string().valid("soft", "hard").required(),
      price: Joi.number().min(0).required(),
      authorforbook: Joi.string().required() // ObjectId كـ string
    });
  
    return schema.validate(obj);
  }
  

// مخطط التحقق لتحديث الكتاب (يمكنك تعديل المطلوب حسب الحاجة)
function validateUpdateBook(obj) {
    const schema = Joi.object({
      title: Joi.string().min(3).max(15),
      description: Joi.string().min(3).max(95),
      cover: Joi.string().valid("soft", "hard"),
      price: Joi.number().min(0),
      authorforbook: Joi.string()
    });
  
    return schema.validate(obj);
  }
  
  


  const Book = mongoose.model('Book', BookSchema);

module.exports ={Book,validateCreateBook,validateUpdateBook}