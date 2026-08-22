import "./App.css";
import TodosPage from "./features/Todos/TodosPage";
import Header from "./shared/Header";
import Logon from "./features/Logon";

function App() {
	
	return (
		<>
			<Header />
			<TodosPage />
			<Logon />
		</>
	);
}

export default App;
