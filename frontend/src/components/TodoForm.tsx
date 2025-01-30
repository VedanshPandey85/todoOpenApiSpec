import { useState } from 'react';
import { createTodo } from '../services/TodoServices';
import { CreateTodoInput } from '../Types/Todo';

interface TodoFormProps {
  onTodoCreated: () => void;
  onError: (error: string) => void;
}

const TodoForm = ({ onTodoCreated, onError }: TodoFormProps) => {
  const [title, setTitle] = useState('');
  const [completed, setCompleted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    try {
      const newTodo: CreateTodoInput = {
        title: title.trim(),
        completed,
        tags: []
      };
      await createTodo(newTodo);
      setTitle('');
      setCompleted(false);
      onTodoCreated();
    } catch (error) {
      onError(error instanceof Error ? error.message : 'Failed to create todo');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="flex flex-col space-y-4">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter a new todo"
          className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
          disabled={isSubmitting}
        />
        <div className="flex items-center">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={completed}
              onChange={(e) => setCompleted(e.target.checked)}
              className="form-checkbox h-5 w-5 text-blue-500"
              disabled={isSubmitting}
            />
            <span>Completed</span>
          </label>
        </div>
        <button
          type="submit"
          disabled={isSubmitting || !title.trim()}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 
                    transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Adding...' : 'Add Todo'}
        </button>
      </div>
    </form>
  );
};

export default TodoForm;