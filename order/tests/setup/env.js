process.env.NODE_ENV = 'test';
process.env.MONGO_URI = 'mongodb://localhost:27017/test-db-skip-real';
process.env.JWT_SECRET = process.env.JWT_SECRET || '4fe25fd54249579682cc363d9972e05fed2a51c9e7a779f31ae4baa02a2198a5';
process.env.JWT_COOKIE_NAME = process.env.JWT_COOKIE_NAME || 'token';
