import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = '/api/todos';

function App() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState('');

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    const res = await axios.get(API_URL);
    setTodos(res.data);
  };

  const addTodo = async () => {
    if (!title.trim()) return;
    const res = await axios.post(API_URL, { title });
    setTodos([...todos, res.data]);
    setTitle('');
  };

  const toggleTodo = async (id, completed) => {
    const res = await axios.put(`${API_URL}/${id}`, { completed: !completed });
    setTodos(todos.map(t => t._id === id ? res.data : t));
  };

  const deleteTodo = async (id) => {
    await axios.delete(`${API_URL}/${id}`);
    setTodos(todos.filter(t => t._id !== id));
  };

  return (
    <div style={{ maxWidth: '500px', margin: '50px auto', fontFamily: 'sans-serif', color: '#ffffff' }}>
      <h1>Todo List</h1>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addTodo()}
          placeholder="할 일 입력..."
          style={{ flex: 1, padding: '8px', fontSize: '16px' }}
        />
        <button onClick={addTodo} style={{ padding: '8px 16px', fontSize: '16px' }}>
          추가
        </button>
      </div>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {todos.map(todo => (
          <li key={todo._id} style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '8px', borderBottom: '1px solid #eee'
          }}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo._id, todo.completed)}
            />
            <span style={{
              flex: 1,
              textDecoration: todo.completed ? 'line-through' : 'none',
              color: todo.completed ? '#888' : '#ffffff'
            }}>
              {todo.title}
            </span>
            <button onClick={() => deleteTodo(todo._id)} style={{ color: 'red', border: 'none', cursor: 'pointer' }}>
              삭제
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;