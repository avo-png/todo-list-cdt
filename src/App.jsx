import "./App.css";
import TodoForm from "./TodoForm";
import TodoList from "./TodoList";
import { useState } from "react";

const todos = [
	// { id: 1, title: "review resources" },
	// { id: 2, title: "take notes" },
	// { id: 3, title: "code out app" },
];

function App() {
	const [todoList, setTodoList] = useState([]);

	function addTodo(todoTitle) {
		// id: Date.now(), title: "todoTitle",
		const newTodo = {
			id: Date.now(),
			title: todoTitle,
		};

		setTodoList((previous) => [newTodo, ...previous]);
	}

	return (
		<>
			<div>
				<h1>Todo List</h1>
				<TodoForm />
				<TodoForm onAddTodo={addTodo} />
				<TodoList todoList={todoList} />
			</div>
		</>
	);
}

export default App;
