import { useState, useEffect, useCallback } from "react";
import TodoForm from "./TodoForm";
import TodoList from "./TodoList/TodoList";
import SortBy from "../../shared/SortBy";
import useDebounce from "../../utils/useDebounce";
import FilterInput from "../../shared/FilterInput";

function TodosPage({ token }) {
	const [todoList, setTodoList] = useState([]);
	const [error, setError] = useState("");
	const [sortBy, setSortBy] = useState("createdAt");
	const [sortDirection, setSortDirection] = useState("desc");
	const [isTodoListLoading, setIsTodoListLoading] = useState(false);
	const [filterTerm, setFilterTerm] = useState("");
	const debouncedFilterTerm = useDebounce(filterTerm, 300);
	const handleFilterChange = (newTerm) => {
		setFilterTerm(newTerm);
	};
	const [dataVersion, setDataVersion] = useState(0);

	const invalidateCache = useCallback(() => {
		console.log("Invalidating memo cache after todo mutation");
		setDataVersion((prev) => prev + 1);
	}, []);

	useEffect(() => {
		async function fetchTodos() {
			setIsTodoListLoading(true);
			setError("");

			try {
				const paramsObject = {
					sortBy,
					sortDirection,
					limit: 100,
				};

				if (debouncedFilterTerm) {
					paramsObject.find = debouncedFilterTerm;
				}

				const params = new URLSearchParams(paramsObject);

				const response = await fetch(`/api/tasks?${params}`, {
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
	}, [token, sortBy, sortDirection, debouncedFilterTerm]);

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

			invalidateCache();

			const savedTodo = await response.json();

			setTodoList((previous) =>
				previous.map((todo) => (todo.id === newTodo.id ? savedTodo : todo)),
			);

			invalidateCache();
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

			<SortBy
				sortBy={sortBy}
				sortDirection={sortDirection}
				onSortByChange={setSortBy}
				onSortDirectionChange={setSortDirection}
			/>

			<FilterInput
				filterTerm={filterTerm}
				onFilterChange={handleFilterChange}
			/>

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
