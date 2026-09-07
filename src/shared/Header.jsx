import { useAuth } from "../contexts/AuthContexts";

function Header() {
	const { isAuthenticated } = useAuth();

	return (
		<>
			<div>
				<h1>Todo List</h1>
			</div>
		</>
	);
}

export default Header;
