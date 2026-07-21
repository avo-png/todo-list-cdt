import "./App.css";
import TodoList from "./TodoList";

function App() {
	const todoList = [
		{ id: 1, title: "return packages" },
		{ id: 2, title: "install barrels" },
		{ id: 3, title: "clean garage" },
	];
	return (
		<>
			<div>
				<h1>My Todos</h1>
				{/* <ul>
					{todoList.map((todo) => (
						<li key={todo.id}>{todo.title}</li>
					))}
				</ul> */}
				<TodoList />
			</div>
		</>
	);
}

export default App;
