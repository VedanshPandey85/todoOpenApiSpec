import axios, { AxiosError } from 'axios';
import { Todo, CreateTodoInput, UpdateTodoInput } from '../Types/Todo';

const API_BASE_URL = 'http://localhost:3000/api';

const handleApiError = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    throw new Error(error.response?.data?.message || 'An error occurred');
  }
  throw error;
};

export const getTodos = async (
  page: number = 1,
  limit: number = 10,
  tags?: string
): Promise<Todo[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/todos`, {
      params: { page, limit, tags }
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
    return [];
  }
};

export const createTodo = async (todo: CreateTodoInput): Promise<Todo> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/todos`, todo);
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

export const updateTodo = async (id: number, todo: UpdateTodoInput): Promise<Todo> => {
  try {
    const response = await axios.put(`${API_BASE_URL}/todos/${id}`, todo);
    console.log(response.data);
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

export const deleteTodo = async (id: number): Promise<void> => {
  try {
    await axios.delete(`${API_BASE_URL}/todos/${id}`);
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};