import { Request, Response } from 'express';
import pool from '../services/db';
import { TodoQuerySchema, CreateTodoSchema, UpdateTodoSchema, TodoIdSchema } from '../schema';
import { z } from 'zod';

export const getTodos = async (req: Request, res: Response): Promise<void> => {
  try {
    const { page, limit, tags } = TodoQuerySchema.parse(req.query);
    const offset = (page - 1) * limit;

    let query = 'SELECT * FROM TODOS';
    const params: any[] = [limit, offset];

    if (tags) {
      query += ' WHERE $3 = ANY (tags)';  
      params.push(tags);
    }

    query += ' LIMIT $1 OFFSET $2';

    const result = await pool.query(query, params);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error fetching todos:', err);
    res.status(500).json({ message: 'An error occurred while fetching todos' });
  }
};
export const createTodo = async (req: Request, res: Response): Promise<void> => {
  try {
    const todoData = CreateTodoSchema.parse(req.body);
    console.log(todoData)
    const result = await pool.query(
      'INSERT INTO TODOS (TITLE, COMPLETED, TAGS) VALUES ($1, $2, $3) RETURNING *',
      [todoData.title, todoData.completed || false, todoData.tags||[]]
    );

    if (!result.rows[0]) {
      res.status(400).json({ error: 'Invalid todo data' });
      return;
    }

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating todo:', err);
    res.status(500).json({ error: 'An error occurred while creating the todo' });
  }
};

export const updateTodo = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = TodoIdSchema.parse(req.params);
    const todoData = UpdateTodoSchema.parse(req.body);

    const result = await pool.query(
      'UPDATE TODOS SET TITLE = $1, COMPLETED = $2, TAGS = $3 WHERE ID = $4 RETURNING *',
      [todoData.title, todoData.completed, todoData.tags, id]
    );

    if (result.rowCount === 0) {
      res.status(404).json({ error: 'TODO not found' });
      return;
    }

    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error('Error updating todo:', err);

    if (err instanceof z.ZodError) {
      res.status(400).json({ error: 'Invalid input', details: err.errors });
      return;
    }

    res.status(500).json({ error: 'An error occurred while updating the todo' });
  }
};

export const deleteTodo = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = TodoIdSchema.parse(req.params);
    const result = await pool.query('DELETE FROM TODOS WHERE ID = $1', [parseInt(id, 10)]);

    if (result.rowCount === 0) {
      res.status(404).json({ error: 'TODO not found' });
      return;
    }

    res.status(200).json({ message: 'TODO deleted successfully' });
  } catch (err) {
    console.error('Error deleting todo:', err);

    if (err instanceof z.ZodError) {
      res.status(400).json({ error: 'Invalid ID', details: err.errors });
      return;
    }

    res.status(500).json({ error: 'An error occurred while deleting the todo' });
  }
};