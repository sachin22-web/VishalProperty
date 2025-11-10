import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import UserModel from '../models/User';

(async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI not set in .env');

  await mongoose.connect(uri);

  const email = 'admin@vishalproperty.com';
  const plain = 'Admin@12345';
  const passwordHash = await bcrypt.hash(plain, 10);

  // lowercase email for safety
  const filter = { email: email.toLowerCase() };

  const res = await UserModel.updateOne(
    filter,
    { $set: { passwordHash }, $unset: { password: '' } },
    { upsert: false }
  );

  const doc = await UserModel.findOne(filter).lean();
  console.log('update.modifiedCount =', res.modifiedCount, 'hasHash =', !!doc?.passwordHash);

  await mongoose.disconnect();
  process.exit(0);
})().catch((e) => {
  console.error('fixAdmin error:', e);
  process.exit(1);
});
