import dotenv from 'dotenv';
import cloudinary from 'cloudinary';

const env = process.env.NODE_ENV || 'development';
if (env !== 'production') {
  dotenv.config({ silent: true });
}

const config = {
  database: process.env.MONGO_URL,
  secret: process.env.SECRET
};

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

if (env === 'test') {
  config.database = process.env.MONGO_TEST_URL;
}

export default config;
