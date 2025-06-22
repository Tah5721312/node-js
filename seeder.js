// seeder/seeder.js

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { User } = require('./models/User');
const { Book } = require('./models/Book');
const { Author } = require('./models/Author');
const connectToDB = require('./config/db');

connectToDB();

async function seedDatabase() {
  try {
    // حذف البيانات السابقة (اختياري)
    // await User.deleteMany();
    // await Author.deleteMany();
    // await Book.deleteMany();

    // 1. إنشاء المستخدمين
    const salt = await bcrypt.genSalt(10);
    const users = [
      {
        username: 'admin',
        email: 'admin1@example.com',
        password: await bcrypt.hash('123456', salt),
        isAdmin: true
      },
      {
        username: 'user1',
        email: 'user11@example.com',
        password: await bcrypt.hash('123456', salt),
        isAdmin: false
      },
      {
        username: 'user2',
        email: 'user21@example.com',
        password: await bcrypt.hash('123456', salt),
        isAdmin: false
      },
    ];
    await User.insertMany(users);
    console.log('✅ Users seeded successfully!');

    // 2. إنشاء المؤلفين
    const authorsData = [
      { firstname: "Nassim", lastname: "Taleb", nationality: "USA" },
      { firstname: "Elif", lastname: "Shafak", nationality: "Turkey" },
    ];
    const createdAuthors = await Author.insertMany(authorsData);
    console.log('✅ Authors seeded successfully!');

    // احصل على المعرفات
    const talebId = createdAuthors.find(a => a.lastname === "Taleb")._id;
    const elifId = createdAuthors.find(a => a.lastname === "Shafak")._id;

    // 3. إنشاء الكتب مع ربطها بالمؤلفين
    const books = [
      {
        title: "Black Swan",
        authorforbook: talebId,
        description: "About Black Swan",
        price: 10,
        cover: "soft",
      },
      {
        title: "Skin In The Game",
        authorforbook: talebId,
        description: "About Skin In The Game",
        price: 12,
        cover: "soft",
      },
      {
        title: "Fooled By Randomness",
        authorforbook: talebId,
        description: "About Fooled By Randomness",
        price: 8,
        cover: "hard",
      },
      {
        title: "The Forty Rules Of Love",
        authorforbook: elifId,
        description: "About The Forty Rules Of Love",
        price: 14,
        cover: "soft",
      },
      {
        title: "The Island Of Missing Trees",
        authorforbook: elifId,
        description: "About The Island Of Missing Trees",
        price: 9,
        cover: "soft",
      },
      {
        title: "The Flea Palace",
        authorforbook: elifId,
        description: "About The Flea Palace",
        price: 10,
        cover: "hard",
      },
    ];
    await Book.insertMany(books);
    console.log('✅ Books seeded successfully!');

    console.log('🌱 All data seeded successfully!');
    process.exit();

  } catch (error) {
    console.error('❌ Seeding error:', error.message);
    process.exit(1);
  }
}

seedDatabase();
