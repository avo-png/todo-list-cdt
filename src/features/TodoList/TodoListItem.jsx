import { useState } from "react";
import TextInputWithLabel from "../../shared/TextInputWithLabel";

function TodoListItem({ todo, onCompleteTodo }) {
	const [isEditing, setIsEditing] = useState(false);
	const [workingTitle, setWorkingTitle] = useState(todo.title);
	const handleCancel = () => {
		setWorkingTitle(todo.title);
		setIsEditing(false);
	};
	const handleEdit = (event) => {
		setWorkingTitle(event.target.value);
	}

	return (
		<>
			{isEditing ? (
				<TextInputWithLabel value={workingTitle} onChange={handleEdit}/>,
				<button type="button" onClick={handleCancel}>Cancel</button>
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
