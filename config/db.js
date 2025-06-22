const mongoose = require("mongoose");

async function connectToDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB connected.");
  } catch (error) {
    console.log("❌ MongoDB connection error:", error);
  }
}

module.exports = connectToDB;

// mongoose.connect(process.env.MONGODB_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// })
// .then(() => console.log('✅ MongoDB connected.'))
// .catch(err => console.error('❌ MongoDB connection error:', err));
