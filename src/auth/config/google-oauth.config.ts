import { registerAs } from '@nestjs/config';

export default registerAs('googleOAuth', () => ({

  f:console.log("process.env.GOOGLE_CLIENT_ID",process.env.GOOGLE_CLIENT_ID,"process.env.GOOGLE_SECRET",process.env.GOOGLE_SECRET,"process.env.GOOGLE_CALLBACK_URL",process.env.GOOGLE_CALLBACK_URL),
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL,
}));