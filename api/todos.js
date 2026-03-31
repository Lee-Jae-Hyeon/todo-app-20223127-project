const mongoose = require('mongoose');

let isConnected = false;

const todoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  completed: { type: Boolean, default: false }
});

let Todo;
try {
  Todo = mongoose.model('Todo');
} catch {
  Todo = mongoose.model('Todo', todoSchema);
}

async function connectDB() {
  if (isConnected) return;
  const uri = process.env.MONGODB_URI;
  console.log('URI starts with:', uri ? uri.substring(0, 20) : 'UNDEFINED');
  await mongoose.connect(uri);
  isConnected = true;
}

module.exports = async (req, res) => {
  await connectDB();

  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const id = req.url.split('/').pop();

  if (req.method === 'GET') {
    const todos = await Todo.find();
    return res.json(todos);
  }

  if (req.method === 'POST') {
    const newTodo = new Todo({ title: req.body.title });
    await newTodo.save();
    return res.json(newTodo);
  }

  if (req.method === 'PUT') {
    const todo = await Todo.findByIdAndUpdate(id, { completed: req.body.completed }, { new: true });
    return res.json(todo);
  }

  if (req.method === 'DELETE') {
    await Todo.findByIdAndDelete(id);
    return res.json({ message: '삭제 완료' });
  }

  res.status(405).json({ message: 'Method not allowed' });
};
