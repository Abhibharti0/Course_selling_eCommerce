import dotenv from 'dotenv';

dotenv.config();


const JWT_USER_PASSWORD = process.env.JWT_USER_PASSWORD || 'user123';
const JWT_ADMIN_PASSWORD = process.env.JWT_ADMIN_PASSWORD || 'user123';

const STRIPE_SECRET_KEY="sk_test_51SaapsB2Xb6LSmp3MP2mdVfQL3EbtTcs0PHfjCA2HxA9pz5fzFoxvtiYBHicrDAd5O694FE1RHD075kK3Vlb7Lof003vlXmLOf"

export default {
  JWT_USER_PASSWORD,
  JWT_ADMIN_PASSWORD,
  STRIPE_SECRET_KEY
};