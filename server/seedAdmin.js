require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const { ENV, USER_ROLES } = require('./config/constants');

const seedAdmin = async () => {
  try {
    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;

    if (!email || !password) {
      console.error('❌ Error: ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env file');
      process.exit(1);
    }

    await mongoose.connect(ENV.MONGO_URI || process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    const existingAdmin = await User.findOne({ email });
    if (existingAdmin) {
      console.log('⚠️ Admin user already exists with this email.');
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const adminUser = await User.create({
      name: 'System Admin',
      email,
      password: hashedPassword,
      role: USER_ROLES.ADMIN,
      onboardingCompleted: true,
      phone: '9999999999' 
    });

    console.log(`✅ Admin user created successfully: ${adminUser.email}`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding admin:', error.message);
    process.exit(1);
  }
};

seedAdmin();
