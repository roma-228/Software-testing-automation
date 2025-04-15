const request = require('supertest');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const app = require('../../app'); // Ваш Express додаток
const User = require('../../models/User');

describe('User Authentication Controller', () => {
  let user;

  beforeAll(async () => {
    await mongoose.connect('mongodb://localhost:27017/testdb', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Створюємо користувача для тестів
    user = new User({
      email: 'test@example.com',
      username: 'testuser',
      password: await bcrypt.hash('password123', 10),
    });
    await user.save();
  });

  afterAll(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.connection.close();
  });

  describe('POST /register', () => {
    it('should register a new user successfully', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ email: 'newuser@example.com', username: 'newuser', password: 'password123' });

      expect(res.statusCode).toEqual(201);
      expect(res.body.message).toBe('User registered successfully');
    });

    it('should return error for missing required fields', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ email: 'missingfields@example.com' });

      expect(res.statusCode).toEqual(400);
      expect(res.body.error).toBeDefined();
    });

    it('should return error for existing email', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ email: 'test@example.com', username: 'testuser2', password: 'password123' });

      expect(res.statusCode).toEqual(400);
    });
  });

  describe('POST /login', () => {
    it('should log in successfully with correct credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'test@example.com', password: 'password123' });

      expect(res.statusCode).toEqual(200);
      expect(res.body.username).toBe('testuser');
      expect(res.body.email).toBe('test@example.com');
    });

    it('should return error for incorrect credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'test@example.com', password: 'wrongpassword' });

      expect(res.statusCode).toEqual(401);
    });

    it('should return error for missing credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({});

      expect(res.statusCode).toEqual(401);
      expect(res.body.error).toBeDefined();
    });
  });
});
