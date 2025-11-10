import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import UserModel from '../models/User';

dotenv.config();

async function run() {
  const uri = process.env.MONGODB_URI as string;
  if (!uri) throw new Error('MONGODB_URI not set');
  await mongoose.connect(uri);

  const email = (process.env.ADMIN_EMAIL || 'admin@vishalproperties.com').toLowerCase();
  const password = process.env.ADMIN_PASSWORD || 'Admin@12345';

  let admin = await UserModel.findOne({ email });
  if (!admin) {
    const passwordHash = await bcrypt.hash(password, 10);
    admin = await UserModel.create({
      name: 'Admin',
      email,
      phone: '0000000000',
      role: 'admin',
      status: 'active',
      passwordHash,
    });
    console.log('✓ Admin user created:', email);
  } else if (admin.role !== 'admin') {
    admin.role = 'admin';
    await admin.save();
    console.log('✓ Existing user promoted to admin:', email);
  } else {
    console.log('• Admin user already exists:', email);
  }

  console.log('\nLogin credentials:');
  console.log('  Email:', email);
  console.log('  Password:', password);

  await mongoose.disconnect();
}

run().catch((e) => {
  console.error('Seed error', e);
  process.exit(1);
});
