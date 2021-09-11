require('dotenv').config();

const {
  PORT = 3000,
  JWT_SECRET = 'dev-secret',
  MONGO_URL = 'mongodb://localhost:27017/bitfilmsdb',
  NODE_ENV,
} = process.env;

module.exports = {
  PORT, JWT_SECRET, MONGO_URL, NODE_ENV,
};
