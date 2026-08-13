import { useState } from "react";
import TextInputWithLabel from "../../shared/TextInputWithLabel";

function TodoListItem({ todo, onCompleteTodo }) {
	const [isEditing, setIsEditing] = useState(false);
	return (
		<>
			{isEditing ? (
				<TextInputWithLabel value={todo.title} />
			) : (
				<>
					<input
						type="checkbox"
						id={`checkbox${todo.id}`}
						checked={todo.isCompleted}
						onChange={() => onCompleteTodo(todo.id)}
					/>
					<span onClick={() => setIsEditing(true)}>{todo.title}</span>
				</>
			)}
		</>
	);
}

export default TodoListItem;
