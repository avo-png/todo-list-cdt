function TodoList() {
	const todoList = [
		{ id: 1, title: "return packages" },
		{ id: 2, title: "install barrels" },
		{ id: 3, title: "clean garage" },
	];
	return (
		<div>
			{
				<ul>
					{todoList.map((todo) => (
						<li key={todo.id}>{todo.title}</li>
					))}
				</ul>
			}
		</div>
	);
}

export default TodoList;
