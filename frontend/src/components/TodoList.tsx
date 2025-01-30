import { useEffect, useState } from 'react';
import { Todo } from '../Types/Todo';
import { getTodos, deleteTodo } from '../services/TodoServices';
import { Trash2 } from 'lucide-react';

interface TodoListProps {
  onError: (error: string) => void;
  refreshTrigger: number;
}

const TodoList = ({ onError, refreshTrigger }: TodoListProps) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchTodos();
  }, [page, limit, refreshTrigger]);

  const fetchTodos = async () => {
    setLoading(true);
    try {
      const data = await getTodos(page, limit);
      setTodos(data);
      setHasMore(data.length === limit);
    } catch (error) {
      onError(error instanceof Error ? error.message : 'Failed to fetch todos');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteTodo(id);
      await fetchTodos();
    } catch (error) {
      onError(error instanceof Error ? error.message : 'Failed to delete todo');
    }
  };

  if (loading && todos.length === 0) {
    return <div className="text-center py-4">Loading...</div>;
  }

  return (
    <div className="space-y-4">
      {todos.length === 0 ? (
        <div className="text-center py-4 text-gray-500">No todos yet!</div>
      ) : (
        <ul className="space-y-2">
          {todos.map((todo) => (
            <li
              key={todo.id}
              className="flex items-center justify-between p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
            >
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  readOnly
                  className="h-5 w-5 text-blue-500"
                />
                <span className={todo.completed ? 'line-through text-gray-500' : ''}>
                  {todo.title}
                </span>
              </div>
              <button
                onClick={() => handleDelete(todo.id)}
                className="text-red-500 hover:text-red-600 p-2 rounded-full hover:bg-red-50 transition-colors"
              >
                <Trash2 size={20} />
              </button>
            </li>
          ))}
        </ul>
      )}
      
      <div className="flex justify-center space-x-4 mt-6">
        <button
          onClick={() => setPage(p => p - 1)}
          disabled={page === 1 || loading}
          className="px-4 py-2 rounded-lg bg-blue-500 text-white disabled:bg-gray-300
                   hover:bg-blue-600 transition-colors disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <button
          onClick={() => setPage(p => p + 1)}
          disabled={!hasMore || loading}
          className="px-4 py-2 rounded-lg bg-blue-500 text-white disabled:bg-gray-300
                   hover:bg-blue-600 transition-colors disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default TodoList;
