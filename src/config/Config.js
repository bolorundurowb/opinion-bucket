import dotenv from 'dotenv';
import cloudinary from 'cloudinary';

const env = process.env.NODE_ENV || 'development';
if (env !== 'production') {
  dotenv.config({ silent: true });
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const Config = {
  database: process.env.MONGO_URL,
  secret: process.env.SECRET,
  mailgun: {
    user: process.env.MAILGUN_SMTP_LOGIN,
    pass: process.env.MAILGUN_SMTP_PASSWORD
  },
  cloudinary
};

if (env === 'test') {
  Config.database = process.env.MONGO_TEST_URL;
}

export default Config;
