export const TODO_ACTIONS = {
	// Fetch operations
	FETCH_START: "FETCH_START",
	FETCH_SUCCESS: "FETCH_SUCCESS",
	FETCH_ERROR: "FETCH_ERROR",

	// Add todo operations
	ADD_TODO_START: "ADD_TODO_START",
	ADD_TODO_SUCCESS: "ADD_TODO_SUCCESS",
	ADD_TODO_ERROR: "ADD_TODO_ERROR",

	COMPLETE_TODO: "COMPLETE_TODO",
	COMPLETE_TODO_SUCCESS: "COMPLETE_TODO_SUCCESS",
	COMPLETE_TODO_ERROR: "COMPLETE_TODO_ERROR",

	UPDATE_TODO_START: "UPDATE_TODO_START",
	UPDATE_TODO_SUCCESS: "UPDATE_TODO_SUCCESS",
	UPDATE_TODO_ERROR: "UPDATE_TODO_ERROR",

	SET_SORT: "SET_SORT",
	SET_FILTER: "SET_FILTER",
	CLEAR_ERROR: "CLEAR_ERROR",
	CLEAR_FILTER_ERROR: "CLEAR_FILTER_ERROR",
	RESET_FILTERS: "RESET_FILTERS",

	INVALIDATE_CACHE: "INVALIDATE_CACHE",
};

export const initialTodoState = {
	todoList: [],
	error: "",
	filterError: "",
	isTodoListLoading: true,
	sortBy: "createdAt",
	sortDirection: "asc",
	filterTerm: "",
	dataVersion: 0,
};

export function todoReducer(state, action) {
	console.log("Dispatched action:", action.type, action.payload); // Remove this before committing
	switch (action.type) {
		case TODO_ACTIONS.FETCH_START:
			return {
				...state,
				isTodoListLoading: true,
				error: "",
				filterError: "",
			};

		case TODO_ACTIONS.INVALIDATE_CACHE:
			return {
				...state,
				dataVersion: state.dataVersion + 1,
			};

		default:
			throw new Error(`Unknown action type: ${action.type}`);
	}
}
