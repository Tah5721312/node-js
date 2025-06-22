const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
  };
  
  const errorHanlder = (err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode; //لو فيه خطأ وما حددتش كود الحالة ➜ هيحط 500 تلقائيًا.
    res.status(statusCode).json({ message: err.message });
  };
  
  
  module.exports = {
      notFound,
      errorHanlder
  }