import "./App.css";
import TodoForm from "./TodoForm";
import TodoList from "./TodoList";
import { useState } from "react";

function App() {
	const [todoList, setTodoList] = useState(todos);
	return (
		<>
			<div>
				<h1>Todo List</h1>
				<TodoForm />
				<TodoList todoList={todoList}/>
			</div>
		</>
	);
}

export default App;
