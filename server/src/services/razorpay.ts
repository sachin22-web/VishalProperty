import Razorpay from 'razorpay';

let instance: Razorpay | null = null;

export function getRazorpay() {
  if (instance) return instance;
  const key_id = process.env.RAZORPAY_KEY_ID as string;
  const key_secret = process.env.RAZORPAY_KEY_SECRET as string;
  if (!key_id || !key_secret) throw new Error('Razorpay credentials not configured');
  instance = new Razorpay({ key_id, key_secret });
  return instance;
}
