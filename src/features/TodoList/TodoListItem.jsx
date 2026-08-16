import { useState } from "react";
import TextInputWithLabel from "../../shared/TextInputWithLabel";
import { isValidTodoTitle } from "../../utils/todoValidation";
import { useEditableTitle } from "../../hooks/useEditableTitle";

function TodoListItem({ todo, onCompleteTodo, onUpdateTodo }) {
	// const [isEditing, setIsEditing] = useState(false);
	// const [workingTitle, setWorkingTitle] = useState(todo.title);
	const {
		isEditing,
		workingTitle,
		startEditing,
		cancelEdit,
		updateTitle,
		finishEdit,
	} = useEditableTitle(todo.title);

	const handleCancel = () => {
		setWorkingTitle(todo.title);
		setIsEditing(false);
	};
	const handleEdit = (event) => {
		setWorkingTitle(event.target.value);
	};
	const handleUpdate = (event) => {
		if (!isEditing) {
			return;
		}
		event.preventDefault();

		if (!isValidTodoTitle(workingTitle)) {
			return;
		}

		onUpdateTodo({
			...todo,
			title: workingTitle,
		});

		setIsEditing(false);
	};
	return (
		<>
			{isEditing ? (
				<>
					<TextInputWithLabel
						value={workingTitle}
						onChange={handleEdit}
					/>

					<button
						type="button"
						onClick={handleCancel}
					>
						Cancel
					</button>

					<button
						type="button"
						onClick={handleUpdate}
					>
						Update
					</button>
				</>
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
