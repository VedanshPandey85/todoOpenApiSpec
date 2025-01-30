import { useState } from 'react'
import './App.css'
import TodoForm from './components/TodoForm'
import TodoList from './components/TodoList'

function App() {
    const [refresh,setRefresh]=useState(false);
    const handleTodoCreated = ()=>{
      setRefresh(!refresh)
    }
    return(
      <>
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold underline mb-4">Todo App</h1>
            <TodoForm onTodoCreated={handleTodoCreated} />
            <TodoList />
       </div>
      </>
    )
}

export default App
