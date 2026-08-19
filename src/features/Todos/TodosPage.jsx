import { useState } from "react";
import TodoForm from "./TodoForm";
import TodoList from "./TodoList/TodoList";

function TodosPage () {
    const [todoList, setTodoList] = useState([]);
    
        function addTodo(todoTitle) {
            const newTodo = {
                id: Date.now(),
                title: todoTitle,
                isCompleted: false,
            };
    
            setTodoList((previous) => [newTodo, ...previous]);
        }
    
        function completeTodo(id) {
            setTodoList(
                todoList.map((todo) => {
                    if (todo.id === id) {
                        return { ...todo, isCompleted: true };
                    }
                    return todo;
                }),
            );
        }
    
        function updateTodo(editedTodo) {
            const updatedTodos = todoList.map((todo) => {
                if (todo.id === editedTodo.id) {
                    return {... editedTodo}
                }
                return todo;
            })
            setTodoList(updatedTodos)
        }
    
    return (
        <>
				<TodoForm onAddTodo={addTodo} />
				<TodoList todoList={todoList} onCompleteTodo={completeTodo} onUpdateTodo={updateTodo}/>
        </>
    )
}

export default TodosPage;