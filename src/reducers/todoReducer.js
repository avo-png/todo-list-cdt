export const TODO_ACTIONS = {
  // Fetch operations
  FETCH_START: 'FETCH_START',
  FETCH_SUCCESS: 'FETCH_SUCCESS',
  FETCH_ERROR: 'FETCH_ERROR',
  
  // Add todo operations
  ADD_TODO_START: 'ADD_TODO_START',
  ADD_TODO_SUCCESS: 'ADD_TODO_SUCCESS',
  ADD_TODO_ERROR: 'ADD_TODO_ERROR',
  
  COMPLETE_TODO: 'COMPLETE_TODO',
  UPDATE_TODO: 'UPDATE_TODO',

  SET_SORT: 'SET_SORT',
  SET_FILTER: 'SET_FILTER',
  CLEAR_ERROR: 'CLEAR_ERROR',
  RESET_FILTERS: 'RESET_FILTERS'
};

export const initialTodoState = {
  todoList: [],
  error: '',
  filterError: '',
  isTodoListLoading: true,
  sortBy: 'createdAt',
  sortDirection: 'asc',
  filterTerm: '',
  dataVersion: 0,
};e