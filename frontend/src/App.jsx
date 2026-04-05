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
    <div style={{
      maxWidth: '500px',
      margin: '0 auto',
      fontFamily: 'sans-serif',
      color: '#ffffff',
      backgroundColor: '#1a1a2e',
      padding: '30px 20px',
      minHeight: '100vh'
    }}>
      <h1 style={{ textAlign: 'center', marginBottom: '24px' }}>Todo List</h1>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addTodo()}
          placeholder="할 일 입력..."
          style={{
            flex: 1,
            padding: '10px',
            fontSize: '16px',
            backgroundColor: '#16213e',
            color: '#ffffff',
            border: '1px solid #0f3460',
            borderRadius: '6px',
            outline: 'none'
          }}
        />
        <button
          onClick={addTodo}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor: '#0f3460',
            color: '#ffffff',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          추가
        </button>
      </div>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {todos.map(todo => (
          <li key={todo._id} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '12px 8px',
            borderBottom: '1px solid #0f3460'
          }}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo._id, todo.completed)}
              style={{ width: '18px', height: '18px', cursor: 'pointer' }}
            />
            <span style={{
              flex: 1,
              textDecoration: todo.completed ? 'line-through' : 'none',
              color: todo.completed ? '#666' : '#ffffff',
              fontSize: '16px'
            }}>
              {todo.title}
            </span>
            <button
              onClick={() => deleteTodo(todo._id)}
              style={{
                color: '#e74c3c',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              삭제
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;