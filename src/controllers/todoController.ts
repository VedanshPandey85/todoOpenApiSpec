import { Request, Response } from 'express';
import pool from '../services/db';





// Get all Todos
export const getTodos = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await pool.query('SELECT * FROM TODOS');
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error fetching todos:', err);
    res.status(500).json({ message: 'An error occurred while fetching todos' });
  }
};


export const createTodo = async (req: Request, res: Response): Promise<void> => {
  const { title } = req.body;

  if (!title) {
    res.status(400).json({ error: 'Title is required' });
    return;
  }




  try {
    const result = await pool.query('INSERT INTO TODOS (title) VALUES ($1) RETURNING *', [title]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating todo:', err);
    res.status(500).json({ error: 'An error occurred while creating the todo' });
  }
};

export const updateTodo = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { completed } = req.body;

  if (typeof completed !== 'boolean') {
    res.status(400).json({ error: 'Completed must be a boolean' });
    return;
  }

  try {
    const result = await pool.query(
      'UPDATE TODOS SET COMPLETED = $1 WHERE ID = $2 RETURNING *',
      [completed, parseInt(id, 10)]
    );

    if (result.rowCount === 0) {
      res.status(404).json({ error: 'TODO not found' });
      return;
    }

    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error('Error updating todo:', err);
    res.status(500).json({ error: 'An error occurred while updating the todo' });
  }
};


export const deleteTodo = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  if (!id || isNaN(parseInt(id, 10))) {
    res.status(400).json({ error: 'Invalid or missing ID' });
    return;
  }

  try {
    const result = await pool.query('DELETE FROM TODOS WHERE ID = $1', [parseInt(id, 10)]);

    if (result.rowCount === 0) {
      res.status(404).json({ error: 'TODO not found' });
      return;
    }

    res.status(200).json({ message: 'TODO deleted successfully' });
  } catch (err) {
    console.error('Error deleting todo:', err);
    res.status(500).json({ error: 'An error occurred while deleting the todo' });
  }
};