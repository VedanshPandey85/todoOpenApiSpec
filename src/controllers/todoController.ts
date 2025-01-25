import { Request, Response } from 'express';
import pool from '../services/db';

/**
 * @swagger
 * components:
 *   schemas:
 *     Todo:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated ID of the todo.
 *         title:
 *           type: string
 *           description: The title of the todo.
 *         completed:
 *           type: boolean
 *           description: The completion status of the todo.
 *       example:
 *         id: 1
 *         title: Buy groceries
 *         completed: false
 *     TodoInput:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           description: The title of the todo.
 *       required:
 *         - title
 *       example:
 *         title: Buy groceries
 */


/**
 * @swagger
 * /todos:
 *   get:
 *     summary: Get all todos
 *     description: Retrieve a list of all todos from the database.
 *     responses:
 *       200:
 *         description: A list of todos.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Todo'
 *       500:
 *         description: Internal server error.
 */





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

/**
 * @swagger
 * /todo:
 *   post:
 *     summary: Create a new todo
 *     description: Add a new todo to the database.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TodoInput'
 *     responses:
 *       201:
 *         description: The created todo.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Todo'
 *       400:
 *         description: Bad request. Title is required.
 *       500:
 *         description: Internal server error.
 */

export const createTodo = async (req: Request, res: Response): Promise<void> => {
  const { title } = req.body;

  if (!title) {
    res.status(400).json({ error: 'Title is required' });
    return;
  }

  /**
 * @swagger
 * /todo/{id}:
 *   put:
 *     summary: Update a todo
 *     description: Update the completion status of a todo by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the todo to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               completed:
 *                 type: boolean
 *                 description: The new completion status of the todo.
 *     responses:
 *       200:
 *         description: The updated todo.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Todo'
 *       400:
 *         description: Bad request. Invalid ID or completed status.
 *       404:
 *         description: Todo not found.
 *       500:
 *         description: Internal server error.
 */



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

/**
 * @swagger
 * /todo/{id}:
 *   delete:
 *     summary: Delete a todo
 *     description: Delete a todo by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the todo to delete.
 *     responses:
 *       200:
 *         description: Todo deleted successfully.
 *       400:
 *         description: Bad request. Invalid ID.
 *       404:
 *         description: Todo not found.
 *       500:
 *         description: Internal server error.
 */

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