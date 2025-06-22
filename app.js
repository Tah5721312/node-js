// using exported function

// const {log} =require("./logging");// how to imports function
// log();  // Outputs: logging

// const http =require("http");

// const books=[
//     {
//         id:1,
//         name:"book1"
//     },
//     {
//         id:2,
//         name:"book2"
//     }
// ]
// const server =http.createServer((req,res) =>{
//     if (req.url==="/"){
//         res.write("<h1>welcome</h1>");
//         res.end();
//     }
//     if (req.url==="/api/books"){
//         res.write(JSON.stringify(books));
//         res.end();
//     }
// }
// );
// const port=5000;
// server.listen(port,()=>console.log(`server is running on port ${port}`));

const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();


const logger =require("./middelwares/logger");
const { notFound, errorHanlder } = require("./middelwares/errors");
const testRouter = require('./routes/test');
const connectToDB = require('./config/db');


const app = express();
const port = process.env.PORT;

// ✅ Connect to MongoDB

connectToDB();

  // ✅ Middleware
app.use(express.json()); // middleware لقراءة JSON من body
app.use(express.urlencoded({extended: false}));
app.use(logger); //يساعد هذا الكود في تتبّع الطلبات (Request Logging)، مما يكون مفيدًا جدًا أثناء التطوير أو عند مراقبة السيرفر.

// Set View Engine
app.set('view engine', 'ejs');


// ربط الراوتر مع الـ API prefix
// ✅ Routes
app.use('/api/books', require('./routes/books'));
app.use('/api/authors', require('./routes/authors'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use("/password", require("./routes/password"));

// Error Hanlder Middleware
app.use(notFound);
app.use(errorHanlder);


// ✅ Start server
app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
