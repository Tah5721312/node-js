const asyncHandler = require('express-async-handler');
const {User,validateLoginUser,validateRegisterUser} =require("../models/User");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


/**
 *  @desc    Register New User
 *  @route   /api/auth/register
 *  @method  POST
 *  @access  public
 */
module.exports.register = asyncHandler(async (req, res) => {
    const { error, value } = validateRegisterUser(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });
    // لازم نتأكد إن email موجود فعليًا بعد الفاليديشن
    if (!value.email) return res.status(400).json({ message: "Email is required." });

    //  نبحث عن الإيميل بشكل غير حساس لحالة الأحرف  case-insensitive email 
    // const existingUser = await User.findOne({ email: value.email });
    const existingUser = await User.findOne({
     email: new RegExp(`^${value.email}$`, 'i')
    });
  
    if (existingUser) {
      return res.status(409).json({ message: "هذا البريد الإلكتروني مسجل بالفعل." });
    }
    // 👇 تشفير كلمة السر
    const salt = await bcrypt.genSalt(10);
    value.password = await bcrypt.hash(value.password, salt);

    const user = new User(value);
    const result = await user.save();
    
    const token = user.generateToken();
    
    const { password, ...userWithoutPassword } = result._doc;
    res.status(201).json({ ...userWithoutPassword, token });
})


/**
 *  @desc    Login User
 *  @route   /api/auth/login
 *  @method  POST
 *  @access  public
 */
module.exports.login =asyncHandler(async (req, res) => {
    console.log("Request body:", req.body); // 👈 تحقق من البيانات المُرسلة
    const { error, value } = validateLoginUser(req.body);
     // معالجة الخطأ في الفاليديشن
  if (error || !value) {
    return res.status(400).json({
      message: error?.details?.[0]?.message || "Invalid login input."
    });
      }
    const { email, password } = value;
  
    // نبحث عن المستخدم بإيميل غير حساس لحالة الأحرف
    const user = await User.findOne({
      email: new RegExp(`^${email}$`, 'i')
    });
  
    if (!user) {
      return res.status(401).json({ message: "البريد الإلكتروني أو كلمة المرور غير صحيحة." });
    }
  
    // نقارن كلمة السر المُدخلة مع كلمة السر المشفرة
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ message: "البريد الإلكتروني أو كلمة المرور غير صحيحة." });
    }
  
    // هنا ممكن تولد JWT إذا حبيت، مثلاً:
    // const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    
    const token = user.generateToken();

  
    const { password: userPassword, ...userWithoutPassword } = user._doc;
    res.status(200).json({ ...userWithoutPassword, token });
  })




