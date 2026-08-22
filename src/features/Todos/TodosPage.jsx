import { useState, useEffect } from "react";
import TodoForm from "./TodoForm";
import TodoList from "./TodoList/TodoList";

function TodosPage({ token }) {
	const [todoList, setTodoList] = useState([]);
	const [error, setError] = useState("");
	const [isTodoListLoading, setIsTodoListLoading] = useState(false);

	useEffect(() => {
		async function fetchTodos() {
			setIsTodoListLoading(true);
			setError("");

			try {
				const response = await fetch("/api/tasks?limit=100", {
					method: "GET",
					headers: {
						"X-CSRF-TOKEN": token,
					},
					credentials: "include",
				});

				if (response.status === 401) {
					throw new Error("unauthorized");
				}

				if (!response.ok) {
					throw new Error("Unable to fetch todos.");
				}

				const data = await response.json();
				setTodoList(data);
			} catch (error) {
				setError(error.message);
			} finally {
				setIsTodoListLoading(false);
			}
		}

		if (token) {
			fetchTodos();
		}
	}, [token]);

	async function addTodo(todoTitle) {
		const newTodo = {
			id: Date.now(),
			title: todoTitle,
			isCompleted: false,
		};

		setTodoList((previous) => [newTodo, ...previous]);

		try {
			const response = await fetch("/api/tasks", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"X-CSRF-TOKEN": token,
				},
				credentials: "include",
				body: JSON.stringify({
					title: newTodo.title,
					isCompleted: newTodo.isCompleted,
				}),
			});

			if (!response.ok) {
				throw new Error("Unable to add todo.");
			}

			const savedTodo = await response.json();

			setTodoList((previous) =>
				previous.map((todo) => (todo.id === newTodo.id ? savedTodo : todo)),
			);
		} catch (error) {
			setTodoList((previous) =>
				previous.filter((todo) => todo.id !== newTodo.id),
			);

			setError(error.message);
		}
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
				return { ...editedTodo };
			}

			return todo;
		});

		setTodoList(updatedTodos);
	}

	return (
		<>
			{error && (
				<div>
					<p>{error}</p>
					<button onClick={() => setError("")}>Clear Error</button>
				</div>
			)}

			{isTodoListLoading && <p>Loading todos...</p>}

			<TodoForm onAddTodo={addTodo} />

			<TodoList
				todoList={todoList}
				onCompleteTodo={completeTodo}
				onUpdateTodo={updateTodo}
			/>
		</>
	);
}

export default TodosPage;
