import { useEffect, useCallback, useReducer } from "react";
import { useAuth } from "../../contexts/AuthContexts";
import TodoForm from "./TodoForm";
import TodoList from "./TodoList/TodoList";
import SortBy from "../../shared/SortBy";
import useDebounce from "../../utils/useDebounce";
import FilterInput from "../../shared/FilterInput";
import {
	initialTodoState,
	TODO_ACTIONS,
	todoReducer,
} from "../../reducers/todoReducer";

function TodosPage() {
	const { token } = useAuth();
	const [state, dispatch] = useReducer(todoReducer, initialTodoState);

	const {
		todoList,
		error,
		sortBy,
		sortDirection,
		isTodoListLoading,
		filterTerm,
		dataVersion,
		filterError,
	} = state;

	const debouncedFilterTerm = useDebounce(filterTerm, 300);
	const handleFilterChange = (newTerm) => {
		dispatch({
			type: TODO_ACTIONS.SET_FILTER,
			payload: newTerm,
		});
	};

	const invalidateCache = useCallback(() => {
		dispatch({
			type: TODO_ACTIONS.INVALIDATE_CACHE,
		});
	}, []);

	useEffect(() => {
		async function fetchTodos() {
			dispatch({ type: TODO_ACTIONS.FETCH_START });

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

				dispatch({
					type: TODO_ACTIONS.FETCH_SUCCESS,
					payload: {
						todos: data,
					},
				});
			} catch (error) {
				const isFilterError =
					debouncedFilterTerm ||
					sortBy !== "createdAt" ||
					sortDirection !== "desc";

				dispatch({
					type: TODO_ACTIONS.FETCH_ERROR,
					payload: {
						message: `Error fetching todos: ${error.message}`,
						isFilterError,
					},
				});
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

		dispatch({
			type: TODO_ACTIONS.ADD_TODO_START,
			payload: {
				todo: newTodo,
			},
		});

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

			dispatch({
				type: TODO_ACTIONS.ADD_TODO_SUCCESS,
				payload: {
					tempId: newTodo.id,
					todo: savedTodo,
				},
			});

			invalidateCache();
		} catch (error) {
			dispatch({
				type: TODO_ACTIONS.ADD_TODO_ERROR,
				payload: {
					todo: newTodo,
					message: error.message,
				},
			});
		}
	}

	async function completeTodo(id) {
		const todo = todoList.find((item) => item.id === id);

		if (!todo) {
			return;
		}

		dispatch({
			type: TODO_ACTIONS.COMPLETE_TODO_START,
			payload: {
				todo,
			},
		});

		try {
			const response = await fetch(`/api/tasks/${id}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					"X-CSRF-TOKEN": token,
				},
				credentials: "include",
				body: JSON.stringify({
					...todo,
					isCompleted: true,
				}),
			});

			if (!response.ok) {
				throw new Error("Unable to complete todo.");
			}

			const updatedTodo = await response.json();

			dispatch({
				type: TODO_ACTIONS.COMPLETE_TODO_SUCCESS,
				payload: {
					todo: updatedTodo,
				},
			});

			invalidateCache();
		} catch (error) {
			dispatch({
				type: TODO_ACTIONS.COMPLETE_TODO_ERROR,
				payload: {
					todo,
					message: error.message,
				},
			});
		}
	}

	async function updateTodo(editedTodo) {
		const previousTodo = todoList.find((todo) => todo.id === editedTodo.id);

		if (!previousTodo) {
			return;
		}

		dispatch({
			type: TODO_ACTIONS.UPDATE_TODO_START,
			payload: {
				todo: editedTodo,
			},
		});

		try {
			const response = await fetch(`/api/tasks/${editedTodo.id}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					"X-CSRF-TOKEN": token,
				},
				credentials: "include",
				body: JSON.stringify(editedTodo),
			});

			if (!response.ok) {
				throw new Error("Unable to update todo.");
			}

			const updatedTodo = await response.json();

			dispatch({
				type: TODO_ACTIONS.UPDATE_TODO_SUCCESS,
				payload: {
					todo: updatedTodo,
				},
			});

			invalidateCache();
		} catch (error) {
			dispatch({
				type: TODO_ACTIONS.UPDATE_TODO_ERROR,
				payload: {
					todo: previousTodo,
					message: error.message,
				},
			});
		}
	}

	return (
		<>
			{error && (
				<div>
					<p>{error}</p>
					<button
						onClick={() =>
							dispatch({
								type: TODO_ACTIONS.CLEAR_ERROR,
							})
						}
					>
						Clear Error
					</button>
				</div>
			)}

			{filterError && (
				<div>
					<p>{filterError}</p>

					<button
						onClick={() =>
							dispatch({
								type: TODO_ACTIONS.CLEAR_FILTER_ERROR,
							})
						}
					>
						Clear Filter Error
					</button>

					<button
						onClick={() =>
							dispatch({
								type: TODO_ACTIONS.RESET_FILTERS,
							})
						}
					>
						Reset Filters
					</button>
				</div>
			)}

			{isTodoListLoading && <p>Loading todos...</p>}

			<SortBy
				sortBy={sortBy}
				sortDirection={sortDirection}
				onSortByChange={(newSortBy) =>
					dispatch({
						type: TODO_ACTIONS.SET_SORT,
						payload: {
							sortBy: newSortBy,
							sortDirection,
						},
					})
				}
				onSortDirectionChange={(newSortDirection) =>
					dispatch({
						type: TODO_ACTIONS.SET_SORT,
						payload: {
							sortBy,
							sortDirection: newSortDirection,
						},
					})
				}
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
				dataVersion={dataVersion}
			/>
		</>
	);
}

export default TodosPage;
