const mongoose = require('mongoose');
const Comment = require('../../models/Comment');

describe('Comment Model Test', () => {
  beforeAll(async () => {
    await mongoose.connect('mongodb://localhost:27017/testdb', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterAll(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.connection.close();
  });

  it('Created comment with validate data', async () => {
    const comment = new Comment({
      postId: new mongoose.Types.ObjectId(),
      author: new mongoose.Types.ObjectId(),
      content: 'Це тестовий коментар',
    });

    const savedComment = await comment.save();
    expect(savedComment._id).toBeDefined();
    expect(savedComment.content).toBe('Це тестовий коментар');
  });

  it('No sevd comment witout nessecary field', async () => {
    const comment = new Comment({});
    let err;
    try {
      await comment.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(err.errors.postId).toBeDefined();
    expect(err.errors.author).toBeDefined();
    expect(err.errors.content).toBeDefined();
  });
});
