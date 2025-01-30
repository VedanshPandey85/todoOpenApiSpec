export interface Todo {
        id: number;
        title: string;
        completed: boolean;
        tags?: string[];
      }
      
export type CreateTodoInput = Omit<Todo, 'id'>;
export type UpdateTodoInput = Partial<Todo>;
      