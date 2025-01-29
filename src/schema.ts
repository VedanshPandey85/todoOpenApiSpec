import {z} from 'zod';

//schema for Todo

export const TodoSchema = z.object({
    id: z.number(),
    title: z.string(),
    completed: z.boolean(),
    tags:z.array(z.string()).optional(),
  });

  export const CreateTodoSchema = TodoSchema.omit({ id: true }).extend({
    tags: z.array(z.string()).default([]), 
  });

export const UpdateTodoSchema = TodoSchema.partial();

export const TodoQuerySchema = z.object({
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(100).default(10), 
    tags: z.string().optional(),
});

export const TodoIdSchema = z.object({
    id: z.string().refine((val) => !isNaN(parseInt(val, 10)), {
      message: 'ID must be a valid number',
    }),
});

