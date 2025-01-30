import { useState } from 'react';
import { createTodo } from '../services/TodoServices';

const TodoForm = ({ onTodoCreated }: { onTodoCreated: () => void }) => {
  const [title, setTitle] = useState('');
  const [completed, setCompleted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createTodo({ title, completed });
    setTitle('');
    setCompleted(false);
    onTodoCreated(); 
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter a new todo"
        className="border p-2 mr-2"
        required
      />
      <label>
        <input
          type="checkbox"
          checked={completed}
          onChange={(e) => setCompleted(e.target.checked)}
          className="mr-2"
        />
        Completed
      </label>
      <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
        Add Todo
      </button>
    </form>
  );
};

export default TodoForm;