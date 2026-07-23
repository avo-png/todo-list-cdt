import "./App.css";
import TodoForm from "./TodoForm";
import TodoList from "./TodoList";

function App() {
	return (
		<>
			<div>
				<h1>My Todos</h1>
				<TodoList />
				<TodoForm />
			</div>
		</>
	);
}

export default App;
