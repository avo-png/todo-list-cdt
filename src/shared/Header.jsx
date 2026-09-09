import { useAuth } from "../contexts/AuthContexts";
import Logoff from "../features/Logoff";

function Header() {
	const { isAuthenticated } = useAuth();

	return (
		<header>
			<div>
				<h1>Todo List</h1>

				{isAuthenticated && <Logoff />}
			</div>
		</header>
	);
}

export default Header;
