import { useEffect, useState } from 'react';
import { Todo } from '../Types/Todo';
import { getTodos, deleteTodo } from '../services/TodoServices';

const TodoList = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  useEffect(() => {
    fetchTodos();
  }, [page, limit]);

  const fetchTodos = async () => {
    const data = await getTodos(page, limit);
    setTodos(data);
  };

  const handleDelete = async (id: number) => {
    await deleteTodo(id);
    fetchTodos(); // Refresh the list
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Todo List</h1>
      <ul>
            {Array.isArray(todos) && todos.length > 0 ? ( // Check if it's an array and not empty
              todos.map((todo) => (
                <li key={todo.id} className="flex justify-between items-center p-2 border-b">
                  <span>{todo.title}</span>
                  <button
                    onClick={() => handleDelete(todo.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded"
                  >
                    Delete
                  </button>
                </li>
              ))
            ) : (
              <li>No todos yet!</li> // Or Loading...
            )}
          </ul>
      <div className="mt-4">
        <button
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
          className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
        >
          Previous
        </button>
        <button
          onClick={() => setPage(page + 1)}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default TodoList;