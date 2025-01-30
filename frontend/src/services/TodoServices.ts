import axios from "axios";
import { Todo } from "../Types/Todo";

const API_BASE_URL = "http://localhost:3000/api";

export const getTodos = async(page : number = 1, limit: number =10,tags?:string): Promise<Todo[]>=>{

        const response = await axios.get(`{API_BASE_URL}/todos`,{
            params:{
                page,
                limit,
                tags
            }
        });
        return response.data;
}

export const createTodo = async(todo:Omit<Todo,'id'>):Promise<Todo>=>{
    const response = await axios.post(`${API_BASE_URL}/todos`,todo);
    return response.data;
}

export const updateTodo = async(id:number,todo:Partial<Todo>):Promise<Todo>=>{
    const response = await axios.put(`${API_BASE_URL}/todos/${id}`,todo);
    return response.data;
}

export const deleteTodo = async(id:number):Promise<void>=>{
    await axios.delete(`${API_BASE_URL}/todos${id}`);
}


