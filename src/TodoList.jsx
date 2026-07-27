import TodoListItem from "./TodoListItem";

const todos = [
	{ id: 1, title: "review resources" },
	{ id: 2, title: "take notes" },
	{ id: 3, title: "code out app" },
];

function TodoList({ todoList }) {
	return (
		<ul>
			{todoList.map((todo) => (
				<TodoListItem
					key={todo.id}
					todo={todo}
				/>
			))}
		</ul>
	);
}

export default TodoList;
